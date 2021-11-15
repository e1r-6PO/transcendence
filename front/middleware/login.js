export default async function (context) {

  const ret = await context.$axios.get('api/auth/is_logged')
  .catch(function (error) {
    return error.response
  });
  if (ret.data['status'] == false)
    window.location.href = '/'
  else if (ret.data['status'] == true && ret.data['nickname'] == "" && context.route.path != '/profile/set_nickname')
    window.location.href = '/profile/set_nickname'
  else if (ret.data['status'] == true && ret.data['has2fa'] == true && ret.data['is2factorauthenticated'] == false)
    window.location.href = "/2fa"

}