import http from './http'
import ca from "element-ui/src/locale/lang/ca";

const baseUrl = 'http://localhost:2020'
export const success_code = 2000

export const getUserInfo = (userId) =>{
  if (process.client) {
    return http.requestGet('/user/user_info/' + userId);
  } else {
    return http.requestGet(baseUrl + '/user/user_info/' + userId);
  }
}

export const getCategories = () =>{
  if (process.client) {
    return http.requestGet('/portal/article/categories');
  } else {
    return http.requestGet(baseUrl + '/portal/article/categories');
  }
}
export const getloops = () =>{
  if (process.client) {
    return http.requestGet('/portal/web_site_info/loop');
  } else {
    return http.requestGet(baseUrl + '/portal/web_site_info/loop');
  }
}

export const getTopArticles = () =>{
  if (process.client) {
    return http.requestGet('/portal/article/list/top');
  } else {
    return http.requestGet(baseUrl + '/portal/article/list/top');
  }
}

export const getArticles = (categoryId, page, size) =>{
  if (categoryId !== '') {
    return http.requestGet('/portal/article/list/' + categoryId + '/' + page + '/' + size);
  }
  if (process.client) {
    //客户端
    return http.requestGet('/portal/article/list/' + page + '/' + size);
  } else {
    return http.requestGet(baseUrl + '/portal/article/list/' + page + '/' + size);
  }
}

export const getLabels = (size) =>{
  //客户端请求
  return http.requestGet('/portal/article/label/' + size);
}

export const getLinks = () =>{
  if (process.client) {
    return http.requestGet('/portal/web_site_info/friend_link');
  } else {
    return http.requestGet(baseUrl + '/portal/web_site_info/friend_link');
  }
}

export const getSearchContent = (categoryId, keyword,
                                 page,
                                 size,
                                 sort) => {
    return http.requestGet(baseUrl + "/portal/search?keyword=" + encodeURIComponent(keyword)
      + "&page=" + page + "&size="
      + size + "&categoryId=" + categoryId
      + "&sort=" + sort);
};

export const getLoginQrCode = () =>{
  return http.requestGet('/user/pc-login-qr-code');
}
export const doLogin = (verifyCode, from, hewieUser) => {
  return http.requestPost('/user/login/' + verifyCode  + '?from=' + from, hewieUser);
}
export const checkToken = () => {
  return http.requestGet('/user/check-token');
}
export const doLogout = () => {
  return http.requestGet('/user/logout');
}
export const checkScanLoginState = (loginId) => {
  return http.requestGet('/user/qr-code-state/'+ loginId);
}

export const sendEmailCode = (captchaCode, email, type) => {
  return http.requestGet('/user/verify_code?captchaCode='+captchaCode+'&email='+email+'&type='+type);
}
export const checkUserName = (userName) => {
  return http.requestGet('/user/user_name?user_name=' + userName);
}
export const registerUser = (captchaCode, emailCode, hewieUser) => {
  return http.requestPost('/user/join_in?captcha_code='+captchaCode+'&email_code='+emailCode, hewieUser);
}
export const checkVerifyCode = (captchaCode, email, emailCode) => {
  return http.requestGet('/user/check-email-code?captchaCode='+captchaCode+'&email='+email+'&emailCode='+emailCode);
}
export const updatePassword = (verifyCode, hewieUser) => {
  return http.requestPut('/user/password/'+verifyCode, hewieUser);
}
export const getArticleDetailById = (id) => {
  return http.requestGet(baseUrl +'/portal/article/'+id);
}
export const getRecommendArticles = (id, size) => {
  return http.requestGet(baseUrl +'/portal/article/recommend/'+id+'/'+size);
}

export const getCommentsByArticleId = (id, page, size) => {
  if (process.client) {
    return http.requestGet('/portal/comment/list/'+id+'/'+page+'/'+size);
  } else {
    return http.requestGet(baseUrl + '/portal/comment/list/'+id+'/'+page+'/'+size);
  }
}

export const postComment = (comment) => {
  return http.requestPost('/portal/comment', comment);
}

export const updateUserInfo = (userInfo, userId) => {
  return http.requestPut('/user/user_info/' +　userId, userInfo);
}
