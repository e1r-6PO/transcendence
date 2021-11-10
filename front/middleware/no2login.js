export default async function (context) {

  const ret = await context.$axios.get('api/auth/is_logged')
  .catch(function (error) {
    return error.response
  });
  if (ret.data['status'] == true && ret.data['has2fa'] == true && ret.data['is2factorauthenticated'] == false)
    window.location.href = '/2fa'
  else if (ret.data['status'] == true)
    window.location.href = '/home'
}
