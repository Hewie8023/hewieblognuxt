import * as Api from '../api/api'
export const state = () => ({
  currentActivityTab: 'index',
  currentUserId:'',
  currentUserInfo:''
})
export const mutations = {
  setCurrentActivityTab(state, currentActivityTab) {
    state.currentActivityTab = currentActivityTab
  },
  setCurrentUserId(state, currentUserId){
    state.currentUserId = currentUserId;
  },
  SET_USERINFO(state, userInfo) {
    state.currentUserInfo = userInfo;
  },
}

export const actions = {
  nuxtServerInit({ commit },{ req }) {
    // let cookies = req.headers.cookie;
    // let cookieVal = '';
    // if (cookies !== '') {
    //   let cookieList = cookies.split(';');
    //   cookieList.forEach(item => {
    //     if (item.search('hewie_blog_token') !== -1) {
    //       let res = item.split("=");
    //       cookieVal = res[1]
    //     }
    //   })
    // }
    // let tokenRes = Api.checkToken();
    // console.log(tokenRes.data);
    // console.log(tokenRes);
    // if (tokenRes !== '') {
    //   console.log('into');
    //   commit("SET_USERINFO", tokenRes.data);//保存token
    // }
  }
}
