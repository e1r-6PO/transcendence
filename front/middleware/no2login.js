export default async function (context) {

  console.log("HEYYYYY")

  const ret = await context.$axios.get('api/auth/is_logged')
  .catch(function (error) {
    return error.response
  });
  if (ret.data['status'] == true)
    window.location.href = '/home'
}