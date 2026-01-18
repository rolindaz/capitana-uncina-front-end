export default function LoginPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-3">Log in</h1>
      <p className="text-muted">
        This is a placeholder login page. Wire it to your API when ready.
      </p>

      <div className="row">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    className="form-control"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                </div>

                <button className="btn btn-dark w-100" type="submit">
                  Log in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
