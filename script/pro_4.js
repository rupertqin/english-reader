// import cheerio from 'cheerio'
// import querystring from 'querystring'
// import axios from 'axios'

const cheerio = require('cheerio')
const querystring = require('querystring')
// const request = require('axios')
const request = require('superagent')
const fs = require('fs')

const indexLink = 'http://tem.koolearn.com/20160613/791508.html'

class ProFour {
  constructor (){
    this.start()
  }

  async start(){
    const links = await this.getLinks()
    let allWords = ''
    console.log(links)
    console.log(links.length)

    for (let link of links) {
      let words = await this.getDetails(link)
      words = [].slice.apply(words).join('\n')
      allWords += words
    }
    fs.writeFile('message.txt', allWords, (err) => {
      if (err) throw err;
      console.log(`all Words has been saved!`);
    });
  }

  async getLinks(){
    try {
      const response = await request.get(indexLink)
      const $ = cheerio.load(response.data || response.text);
      let ret = []
      const as = $('.show_l2 table td a')
      for (let i in as) {
        as[i]['attribs'] && as[i]['attribs']['href'] && ret.push(as[i].attribs.href)
      }
      return ret
    } catch (err){
      console.log(err)
    }
  }

  async getDetails(link) {
    let response
    try {
      response = await axios.get(link)
    } catch (err){
      console.log(err)
    }
    const $ = cheerio.load(response.data)
    const words = $('div.mt40 > p').filter(function(k, el) {
      return !!el.firstChild && !!el.firstChild.data && /^([\s]+)?[a-zA-Z]+/.test(el.firstChild.data)
    })
    return words.map(function(i, w) {
      return words[i].firstChild.data.trim()
    })
  }
}


const proFour = new ProFour()