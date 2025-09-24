;; DECENTRALIZED PAYROLL SYSTEM

;; Traits for SIP-010 fungible tokens
(use-trait sip-010-trait .sip-010-trait.sip-010-trait)
 
;; CONSTANTS & ERROR CODES

;; Error codes
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-employee-not-found (err u102))
(define-constant err-employee-exists (err u103))
(define-constant err-insufficient-balance (err u104))
(define-constant err-invalid-amount (err u105))
(define-constant err-payment-not-due (err u106))
(define-constant err-contract-paused (err u107))
(define-constant err-invalid-frequency (err u108))
(define-constant err-employee-inactive (err u109))

;; Payment frequencies (in blocks)
(define-constant weekly-blocks u1008)      ;; ~1 week in blocks (10 min/block)
(define-constant biweekly-blocks u2016)    ;; ~2 weeks in blocks
(define-constant monthly-blocks u4464)     ;; ~1 month in blocks

;; Role constants
(define-constant role-admin u1)
(define-constant role-hr u2)
(define-constant role-finance u3)
(define-constant role-employee u4)

;; DATA VARIABLES

;; Contract owner
(define-data-var contract-owner principal tx-sender)

;; Company information
(define-data-var company-name (string-ascii 50) "")
(define-data-var company-id uint u0)
(define-data-var total-employees uint u0)
(define-data-var total-payments-made uint u0)

;; Contract state
(define-data-var contract-paused bool false)

;; Emergency settings
(define-data-var emergency-delay-blocks uint u144) ;; ~24 hours in blocks

;; DATA MAPS

;; Employee data structure
(define-map employees 
  principal 
  {
    employee-id: (string-ascii 20),
    salary-amount: uint,
    payment-token: principal,
    payment-frequency: uint, ;; 1weekly, 2biweekly, 3monthly
    last-payment-block: uint,
    next-payment-due: uint,
    status: uint, ;; 1active, 2inactive, 3suspended, 4terminated
    total-paid: uint,
    department: (string-ascii 30),
    start-block: uint
  }
)

;; Employee ID to principal mapping
(define-map employee-ids (string-ascii 20) principal)

;; User roles
(define-map user-roles principal uint)

;; Payment history
(define-map payment-records 
  uint 
  {
    employee: principal,
    amount: uint,
    token: principal,
    block-height: uint,
    payment-type: (string-ascii 20), ;; "SALARY", "BONUS", "EMERGENCY"
    notes: (string-ascii 100)
  }
)

;; Payment counter for unique IDs
(define-data-var payment-counter uint u0)

;; Treasury balances per token
(define-map treasury-balances principal uint)

;; Supported tokens
(define-map supported-tokens principal bool)

;; Pending emergency withdrawals
(define-map pending-withdrawals 
  { requester: principal, token: principal } 
  { amount: uint, request-block: uint }
)

;; AUTHORIZATION FUNCTIONS

(define-private (is-contract-owner)
  (is-eq tx-sender (var-get contract-owner))
)

(define-private (has-role (user principal) (required-role uint))
  (match (map-get? user-roles user)
    role-value (or (>= role-value required-role) (is-contract-owner))
    false
  )
)

(define-private (is-employee-active (employee principal))
  (match (map-get? employees employee)
    employee-data (is-eq (get status employee-data) u1)
    false
  )
)

;; ADMIN FUNCTIONS

(define-public (initialize-company (name (string-ascii 50)) (id uint))
  (begin
    (asserts! (is-contract-owner) err-owner-only)
    (asserts! (is-eq (var-get company-id) u0) err-not-authorized)
    (asserts! (> (len name) u0) err-invalid-amount)
    (asserts! (> id u0) err-invalid-amount)
    
    (var-set company-name name)
    (var-set company-id id)
    (ok true)
  )
)

(define-public (set-user-role (user principal) (role uint))
  (begin
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (and (>= role u1) (<= role u4)) err-not-authorized)
    
    ;; Safe to use user principal after validation
    (map-set user-roles user role)
    (ok true)
  )
)

(define-public (pause-contract)
  (begin
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (var-set contract-paused true)
    (ok true)
  )
)

(define-public (unpause-contract)
  (begin
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (var-set contract-paused false)
    (ok true)
  )
)

(define-public (add-supported-token (token principal))
  (begin
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    ;; Admin-controlled token addition is safe
    (map-set supported-tokens token true)
    (ok true)
  )
)
 
;; EMPLOYEE MANAGEMENT FUNCTIONS

(define-public (add-employee 
    (employee-address principal)
    (employee-id (string-ascii 20))
    (salary uint)
    (token principal)
    (frequency uint)
    (department (string-ascii 30))
  )
  (let
    (
      (frequency-blocks (get-frequency-blocks frequency))
      (current-block-height burn-block-height)
    )
    (asserts! (has-role tx-sender role-hr) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (> salary u0) err-invalid-amount)
    (asserts! (and (>= frequency u1) (<= frequency u3)) err-invalid-frequency)
    (asserts! (is-none (map-get? employees employee-address)) err-employee-exists)
    (asserts! (is-none (map-get? employee-ids employee-id)) err-employee-exists)
    (asserts! (default-to false (map-get? supported-tokens token)) err-not-authorized)
    (asserts! (> (len employee-id) u0) err-invalid-amount)
    (asserts! (> (len department) u0) err-invalid-amount)

    ;; Add employee record - all inputs validated above
    (map-set employees employee-address {
      employee-id: employee-id,
      salary-amount: salary,
      payment-token: token,
      payment-frequency: frequency,
      last-payment-block: u0,
      next-payment-due: (+ current-block-height frequency-blocks),
      status: u1,
      total-paid: u0,
      department: department,
      start-block: current-block-height
    })
    
    ;; Map employee ID to address
    (map-set employee-ids employee-id employee-address)
    
    ;; Grant employee role
    (map-set user-roles employee-address role-employee)
    
    (var-set total-employees (+ (var-get total-employees) u1))
    
    (print {
      event: "employee-added",
      employee: employee-address,
      employee-id: employee-id,
      salary: salary,
      token: token
    })
    
    (ok true)
  )
)

(define-public (update-employee-salary (employee principal) (new-salary uint))
  (begin
    (asserts! (has-role tx-sender role-hr) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (> new-salary u0) err-invalid-amount)

    (match (map-get? employees employee)
      employee-data
        (begin
          ;; Employee exists and salary is validated
          (map-set employees employee (merge employee-data { salary-amount: new-salary }))
          (print {
            event: "salary-updated",
            employee: employee,
            new-salary: new-salary
          })
          (ok true)
        )
      err-employee-not-found
    )
  )
)

(define-public (update-employee-status (employee principal) (new-status uint))
  (begin
    (asserts! (has-role tx-sender role-hr) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (and (>= new-status u1) (<= new-status u4)) err-not-authorized)

    (match (map-get? employees employee)
      employee-data
        (begin
          ;; Employee exists and status is validated
          (map-set employees employee (merge employee-data { status: new-status }))
          (print {
            event: "status-updated",
            employee: employee,
            new-status: new-status
          })
          (ok true)
        )
      err-employee-not-found
    )
  )
)

(define-public (remove-employee (employee principal))
  (let
    (
      (employee-data (unwrap! (map-get? employees employee) err-employee-not-found))
      (emp-id (get employee-id employee-data))
    )
    (asserts! (has-role tx-sender role-hr) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)

    ;; Remove mappings - employee existence already verified
    (map-delete employees employee)
    (map-delete employee-ids emp-id)
    (map-delete user-roles employee)

    ;; Update counter
    (var-set total-employees (- (var-get total-employees) u1))

    (print {
      event: "employee-removed",
      employee: employee,
      employee-id: emp-id
    })

    (ok true)
  )
)

;; PAYMENT FUNCTIONS

(define-public (process-salary-payment (employee principal) (token <sip-010-trait>))
  (let
    (
      (employee-data (unwrap! (map-get? employees employee) err-employee-not-found))
      (salary-amount (get salary-amount employee-data))
      (payment-token (get payment-token employee-data))
      (current-balance (default-to u0 (map-get? treasury-balances payment-token)))
      (payment-id (var-get payment-counter))
      (current-block burn-block-height)
      (next-payment (+ current-block (get-frequency-blocks (get payment-frequency employee-data))))
    )
    (asserts! (has-role tx-sender role-finance) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (is-eq (get status employee-data) u1) err-employee-inactive)
    (asserts! (>= current-block (get next-payment-due employee-data)) err-payment-not-due)
    (asserts! (is-eq (contract-of token) payment-token) err-not-authorized)
    (asserts! (>= current-balance salary-amount) err-insufficient-balance)
    
    ;; Update treasury balance
    (map-set treasury-balances payment-token (- current-balance salary-amount))
    
    ;; Update employee data
    (map-set employees employee (merge employee-data {
      last-payment-block: current-block,
      next-payment-due: next-payment,
      total-paid: (+ (get total-paid employee-data) salary-amount)
    }))
    
    ;; Record payment
    (map-set payment-records payment-id {
      employee: employee,
      amount: salary-amount,
      token: payment-token,
      block-height: current-block,
      payment-type: "SALARY",
      notes: "Regular salary payment"
    })
    
    ;; Update counters
    (var-set payment-counter (+ payment-id u1))
    (var-set total-payments-made (+ (var-get total-payments-made) u1))
    
    ;; Transfer tokens to employee
    (try! (contract-call? token transfer salary-amount (as-contract tx-sender) employee none))
    
    (print {
      event: "salary-paid",
      employee: employee,
      amount: salary-amount,
      token: payment-token,
      payment-id: payment-id
    })
    
    (ok payment-id)
  )
)

(define-public (process-bonus-payment 
    (employee principal) 
    (amount uint) 
    (token <sip-010-trait>)
    (notes (string-ascii 100))
  )
  (let
    (
      (employee-data (unwrap! (map-get? employees employee) err-employee-not-found))
      (token-principal (contract-of token))
      (current-balance (default-to u0 (map-get? treasury-balances token-principal)))
      (payment-id (var-get payment-counter))
    )
    (asserts! (has-role tx-sender role-finance) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (is-eq (get status employee-data) u1) err-employee-inactive)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (default-to false (map-get? supported-tokens token-principal)) err-not-authorized)
    (asserts! (>= current-balance amount) err-insufficient-balance)
    (asserts! (> (len notes) u0) err-invalid-amount)

    ;; Update treasury balance
    (map-set treasury-balances token-principal (- current-balance amount))

    ;; Update employee total paid
    (map-set employees employee (merge employee-data {
      total-paid: (+ (get total-paid employee-data) amount)
    }))

    ;; Record payment - notes validated above
    (map-set payment-records payment-id {
      employee: employee,
      amount: amount,
      token: token-principal,
      block-height: burn-block-height,
      payment-type: "BONUS",
      notes: notes
    })
    
    ;; Update counters
    (var-set payment-counter (+ payment-id u1))
    (var-set total-payments-made (+ (var-get total-payments-made) u1))
    
    ;; Transfer tokens to employee
    (try! (contract-call? token transfer amount (as-contract tx-sender) employee none))
    
    (print {
      event: "bonus-paid",
      employee: employee,
      amount: amount,
      token: token-principal,
      payment-id: payment-id
    })
    
    (ok payment-id)
  )
)

(define-public (process-emergency-payment 
    (employee principal) 
    (amount uint) 
    (token <sip-010-trait>)
    (reason (string-ascii 100))
  )
  (let
    (
      (employee-data (unwrap! (map-get? employees employee) err-employee-not-found))
      (token-principal (contract-of token))
      (current-balance (default-to u0 (map-get? treasury-balances token-principal)))
      (payment-id (var-get payment-counter))
    )
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (default-to false (map-get? supported-tokens token-principal)) err-not-authorized)
    (asserts! (>= current-balance amount) err-insufficient-balance)
    (asserts! (> (len reason) u0) err-invalid-amount)
    
    ;; Update treasury balance
    (map-set treasury-balances token-principal (- current-balance amount))
    
    ;; Update employee total paid
    (map-set employees employee (merge employee-data {
      total-paid: (+ (get total-paid employee-data) amount)
    }))

    ;; Record payment - reason validated above
    (map-set payment-records payment-id {
      employee: employee,
      amount: amount,
      token: token-principal,
      block-height: burn-block-height,
      payment-type: "EMERGENCY",
      notes: reason
    })
    
    ;; Update counters
    (var-set payment-counter (+ payment-id u1))
    (var-set total-payments-made (+ (var-get total-payments-made) u1))
    
    ;; Transfer tokens to employee
    (try! (contract-call? token transfer amount (as-contract tx-sender) employee none))
    
    (print {
      event: "emergency-payment",
      employee: employee,
      amount: amount,
      token: token-principal,
      payment-id: payment-id,
      reason: reason
    })
    
    (ok payment-id)
  )
)

;; TREASURY MANAGEMENT FUNCTIONS

(define-public (deposit-funds (amount uint) (token <sip-010-trait>))
  (let
    (
      (token-principal (contract-of token))
      (current-balance (default-to u0 (map-get? treasury-balances token-principal)))
    )
    (asserts! (has-role tx-sender role-finance) err-not-authorized)
    (asserts! (not (var-get contract-paused)) err-contract-paused)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (default-to false (map-get? supported-tokens token-principal)) err-not-authorized)
    
    ;; Transfer tokens to contract
    (try! (contract-call? token transfer amount tx-sender (as-contract tx-sender) none))
    
    ;; Update treasury balance
    (map-set treasury-balances token-principal (+ current-balance amount))
    
    (print {
      event: "funds-deposited",
      depositor: tx-sender,
      amount: amount,
      token: token-principal
    })
    
    (ok true)
  )
)

(define-public (request-emergency-withdrawal (amount uint) (token principal))
  (begin
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (default-to false (map-get? supported-tokens token)) err-not-authorized)
    
    ;; Record withdrawal request
    (map-set pending-withdrawals 
      { requester: tx-sender, token: token }
      { amount: amount, request-block: burn-block-height }
    )
    
    (print {
      event: "withdrawal-requested",
      requester: tx-sender,
      amount: amount,
      token: token
    })
    
    (ok true)
  )
)

(define-public (execute-emergency-withdrawal (requester principal) (token <sip-010-trait>))
  (let
    (
      (token-principal (contract-of token))
      (withdrawal-key { requester: requester, token: token-principal })
      (withdrawal-data (unwrap! (map-get? pending-withdrawals withdrawal-key) err-not-authorized))
      (amount (get amount withdrawal-data))
      (request-block (get request-block withdrawal-data))
      (current-balance (default-to u0 (map-get? treasury-balances token-principal)))
    )
    (asserts! (has-role tx-sender role-admin) err-not-authorized)
    (asserts! (>= (- burn-block-height request-block) (var-get emergency-delay-blocks)) err-not-authorized)
    (asserts! (>= current-balance amount) err-insufficient-balance)
    
    ;; Remove withdrawal request
    (map-delete pending-withdrawals withdrawal-key)
    
    ;; Update treasury balance
    (map-set treasury-balances token-principal (- current-balance amount))
    
    ;; Transfer tokens
    (try! (contract-call? token transfer amount (as-contract tx-sender) requester none))
    
    (print {
      event: "emergency-withdrawal",
      requester: requester,
      amount: amount,
      token: token-principal
    })
    
    (ok true)
  )
)

;; READ-ONLY FUNCTIONS

(define-read-only (get-employee-info (employee principal))
  (map-get? employees employee)
)

(define-read-only (get-employee-by-id (employee-id (string-ascii 20)))
  (match (map-get? employee-ids employee-id)
    employee-address (map-get? employees employee-address)
    none
  )
)

(define-read-only (get-treasury-balance (token principal))
  (default-to u0 (map-get? treasury-balances token))
)

(define-read-only (get-payment-record (payment-id uint))
  (map-get? payment-records payment-id)
)

(define-read-only (get-user-role (user principal))
  (default-to u0 (map-get? user-roles user))
)

(define-read-only (is-payment-due (employee principal))
  (match (map-get? employees employee)
    employee-data (>= burn-block-height (get next-payment-due employee-data))
    false
  )
)

(define-read-only (get-company-info)
  {
    name: (var-get company-name),
    id: (var-get company-id),
    total-employees: (var-get total-employees),
    total-payments: (var-get total-payments-made),
    paused: (var-get contract-paused)
  }
)

(define-read-only (is-supported-token (token principal))
  (default-to false (map-get? supported-tokens token))
)

;; HELPER FUNCTION

(define-private (get-frequency-blocks (frequency uint))
  (if (is-eq frequency u1)
    weekly-blocks
    (if (is-eq frequency u2)
      biweekly-blocks
      monthly-blocks
    )
  )
)