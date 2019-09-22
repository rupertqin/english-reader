import { Injectable, HttpService } from '@nestjs/common';
import {getRepository, getConnection, In} from "typeorm";
import fs = require("fs");
import path = require("path");
import { pick } from "ramda";
import { sleep } from './utils';


import { Dictionary, Levels } from "./dictionary.entity";


type Dict = {
  word: string;
  desc: string;
  level: number;
  pronounce?: string;
}


@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): Dict[] {
    const DictionaryRepo= getRepository(Dictionary);
    const str = fs.readFileSync(path.join(__dirname, '../dict/dict_4.txt'));
    const words: Dict[] = str.toString().split('\n').map(line => {
      const matches = line.match(/^([a-zA-Z\-\.\(\)]+)\s(.+)/);
      if (!matches) return {word: null, desc: null, level: null};
      const [_, word, desc] = matches;

      // save
      const model = new Dictionary();
      model.word = word;
      model.desc = desc;
      model.level = Levels.FOUR;
      DictionaryRepo.save(model);
      return {word, desc, level: Levels.FOUR}
    });
    return words;
  }

  async getWordAlias() {
    const DictionaryRepo= getRepository(Dictionary);
    const words = await DictionaryRepo.find({});
    for (let word of words) {
      const url = `http://youdao.com/w/eng/${word.word}`;
      console.log('ajax with url: ', url);
      try {
        const { data: html } = await this.httpService.get(url).toPromise();
        const matches = html.match(/<span class="additional pattern">\(([^\)]+)\)<\/span>/)
        if (!matches) {
          console.log('no alias word:', word.word);
          continue;
        }
        const [_, aliasStr] = matches;
        const alias = aliasStr.split(',').map(word => word.trim())
        DictionaryRepo.update({word: word.word}, {alias, youdao: html})
        console.log('Saved: ', word.word, alias);
      } catch(err) {
        console.log('Err....::', err)
      }
      await sleep(2);
    }
  }

  parseSix(): Dict[] {
    const DictionaryRepo= getRepository(Dictionary);
    const str: Buffer = fs.readFileSync(path.join(__dirname, '../dict/dict_6.txt'));
    const words: Dict[] = str.toString().split('\n').map(line => {
      const matches: Array<string> = line.match(/^([a-zA-Z\-\.\(\)]+)\s+?(\/([^\/]+)\/)?(.+)$/);
      if (!matches) {
        console.log(line)
        return {word: null, desc: null, level: null, pronounce: null};
      }
      let [_, word, _pronounce, pronounce, desc] = matches;
      pronounce = pronounce.trim()
      desc = desc.trim()

      // save
      const model = new Dictionary();
      model.word = word;
      model.desc = desc;
      model.pronounce = pronounce;
      model.level = Levels.SIX;
      DictionaryRepo.save(model);
      return {word, pronounce, desc, level: Levels.SIX}
    });
    return words;
  }

  parseEight(): Dict[] {
    const DictionaryRepo= getRepository(Dictionary);
    const str: Buffer = fs.readFileSync(path.join(__dirname, '../dict/dict_8.txt'));
    const words: Dict[] = str.toString().split('\n').map(line => {
      const matches: Array<string> = line.match(/^([a-zA-Z\-\.\(\)]+)\s(.+)$/);
      if (!matches) {
        console.log(line)
        return {word: null, desc: null, level: null};
      }
      let [_, word, desc] = matches;
      desc = desc.trim()

      // save
      const model = new Dictionary();
      model.word = word;
      model.desc = desc;
      model.level = Levels.EIGHT;
      DictionaryRepo.save(model);
      return {word, desc, level: Levels.EIGHT}
    });
    return words;
  }

  async parseContent(content) {
    const DictionaryRepo= getRepository(Dictionary);
    const words = content.match(/([a-zA-Z\'\’]+)/g);
    let hasWords = {};
    for(let word of words) {
      const wordData = await DictionaryRepo.findOne({ word })
      if (wordData) {
        hasWords[word] = pick(['desc', 'level', 'alias'])(wordData);
      } else if (word === 'jobs') {
        const wordData = await DictionaryRepo.findOne({ 
          where: { alias: In([word]) } 
        });
        console.log('wordData: ', wordData)
        if (wordData) {
          hasWords[word] = pick(['desc', 'level'])(wordData);
        }
      }
    }
    console.log(hasWords);
    

    return hasWords;
  }
}
