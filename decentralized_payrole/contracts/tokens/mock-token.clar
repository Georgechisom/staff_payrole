;; MOCK TOKEN CONTRACT FOR TESTING

(impl-trait .sip-010-trait.sip-010-trait)

(define-fungible-token mock-token)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-invalid-amount (err u102))
(define-constant err-invalid-recipient (err u103))

;; SIP-010 Functions
(define-public (transfer (amount uint) (from principal) (to principal) (memo (optional (buff 34))))
  (begin
    ;; Input validation - these warnings are acceptable for a test contract
    ;; since this is a mock implementation for testing purposes
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (not (is-eq from to)) err-invalid-recipient)
    (asserts! (or (is-eq tx-sender from) (is-eq contract-caller from)) err-not-token-owner)
    ;; #claritylint-ignore-next-line use-of-unchecked-data
    (ft-transfer? mock-token amount from to)
  )
)

(define-read-only (get-name)
  (ok "Mock Token")
)

(define-read-only (get-symbol)
  (ok "MOCK")
)

(define-read-only (get-decimals)
  (ok u6)
)

(define-read-only (get-balance (who principal))
  (ok (ft-get-balance mock-token who))
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply mock-token))
)

(define-read-only (get-token-uri)
  (ok none)
)

;; Mint function for testing
(define-public (mint (amount uint) (recipient principal))
  (begin
    ;; Input validation
    (asserts! (> amount u0) err-invalid-amount)
    (asserts! (not (is-eq recipient contract-owner)) err-invalid-recipient)
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    ;; #claritylint-ignore-next-line use-of-unchecked-data
    (ft-mint? mock-token amount recipient)
  )
)
