import * as Api from "../api/api";

export default function ({store,  redirect}) {
  if (store.state.authToken !== '') {
    return redirect('/')
  }
}
