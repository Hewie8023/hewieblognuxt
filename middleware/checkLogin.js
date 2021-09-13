import {checkToken} from "../api/api";

export default function (app) {
  if (app.store.state.authToken === '') {
    return app.redirect('/login?redirect='+app.req.url)
  }
}
