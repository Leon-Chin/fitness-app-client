import { request } from './request';

// authentication
export const signin = (data) => request('post', '/auth/signin', data);
export const signinWithGoogle = (data) => request('post', '/auth/google', data);
export const signup = (data) => request('post', '/auth/signup', data);

// conversation
export const getconversation = () => request('get', '/conversations');
export const deleteconversation = (data) => request('delete', '/users/conversations', data);

// messages
export const getcurrentconversationmessages = (conversationID) => request('get', `/messages/${conversationID}`);
export const sendmessage = (data) => request('post', '/messages', data);

// get users file
export const getuser = (userID) => request('get', `/users/find/${userID}`);

// contacts
export const removecontact = (contactID) => request('put', `/users/remove/${contactID}`);
export const addcontact = (contactID, data) => request('put', `/users/add/${contactID}`, data);

// conversation
export const createconversation = (data) => request('post', `/conversations`, data);

// report
export const createreport = (data) => request('post', `/users/report`, data);

// blog
export const getrandomblog = (data) => request('get', `/blogs/random`, data);
export const searchblog = (data) => request('get', `/blogs/search`, data);
export const likeblog = (blogID) => request('put', `/users/like/${blogID}`);
export const cancellikeblog = (blogID) => request('put', `/users/cancellike/${blogID}`);
export const favoriteblog = (blogID) => request('put', `/users/favorite/${blogID}`);
export const cancelfavoriteblog = (blogID) => request('put', `/users/cancelfavorite/${blogID}`);
export const deleteblog = (blogID) => request('delete', `/blogs/${blogID}`);
export const getmyblog = () => request('get', `/blogs/getmyblog`);
export const postblog = (data) => request('post', '/blogs', data)
export const updateblog = (blogID, data) => request('put', `/blogs/${blogID}`, data)



// comments
export const getblogcomments = (blogID) => request('get', `/comments/${blogID}`);
export const addcomment = (data) => request('post', `/comments`, data);
export const likecomment = (commentID) => request('put', `/users/likecomment/${commentID}`);

// tutorial
export const getalltutorial = () => request('get', '/tutorials')
