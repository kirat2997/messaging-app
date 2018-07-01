let { verifyToken } = require('./token.js')

module.exports = async function(req, res, next){
	try {
  	const token = req.headers.authorization.split(' ')[1]
    if(token){
  		const user = await verifyToken(token)
      if(user !== 'undefined'){
        req.user = user
        next()
      }else{
        res.sendStatus(401)
      }
  	}else{
  		console.log('Authorization Token Missing !')
      res.sendStatus(401)
  	}
  } catch (err){
    err.status = 401
    return next(err)
  }
}
