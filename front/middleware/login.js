export default async function (context) {

  const ret = await context.$axios.get('api/auth/is_logged')
  .catch(function (error) {
    return error.response
  });
  var login = new RegExp("/api/(.*)|^/$|/auth/(.*)")
  var nick = new RegExp("/api/(.*)|/profile/set_nickname")
  if (!login.test(context.route.fullPath) && ret.data['status'] == false)
    window.location.href = '/'
  if (!nick.test(context.route.fullPath) && ret.data['status'] == true && ret.data['nickname'] == "")
    window.location.href = '/profile/set_nickname'
}