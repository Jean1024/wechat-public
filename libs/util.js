'use strict'

const fs = require('fs')
const Promise = require('bluebird')

exports.readFileAsync = function(fpath,encoding){
    return new Promise((resolve, reject) => {
      fs.readFile(fpath,encoding,(err,data)=>{
          if(err) reject(err)
          else resolve(data)
      })
    })
    
}
exports.writeFileAsync = function(fpath,content){
    return new Promise((resolve, reject) => {
      fs.writeFile(fpath,content,(err,data)=>{
          if(err) reject(err)
          else resolve(data)
      })
    })
    
}