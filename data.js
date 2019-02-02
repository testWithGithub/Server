const _sessions = {};

const addSession=(token, data) =>{
  _sessions[token] = data;
}

const getSession =(token)=> {
  return _sessions[token];
}



module.exports = {  addSession, getSession };
