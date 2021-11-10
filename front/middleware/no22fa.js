export default async function (context) {

  const ret = await context.$axios.get('api/auth/is_logged')
  .catch(function (error) {
    return error.response
  });
  if (ret.data['status'] == false) //if user not auth goto log page
    window.location.href = '/'
  else if ((ret.data['status'] == true && ret.data['has2fa'] == true && ret.data['is2factorauthenticated'] == true) //if 2fa is already ok or if no 2fa goto /home
      || ret.data['status'] == true && ret.data['has2fa'] == false)
    window.location.href = '/home'
}
  