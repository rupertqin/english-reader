import { Injectable } from '@nestjs/common';
import {getRepository, getConnection} from "typeorm";
import fs = require("fs");
import path = require("path");
import { Dictionary, Levels } from "./dictionary.entity";


type Dict = {
  word: string;
  desc: string;
  level: number;
}


@Injectable()
export class AppService {
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

  async parseContent() {
    const DictionaryRepo= getRepository(Dictionary);
    let content = `Louisiana is in need of a new governor.

      At a time when the national economy is doing much better than it had been in the years prior to Donald Trump taking office, unemployment is at an all-time low, wages are up, and people are generally doing better than they were. The same, however, cannot be said for Louisiana.

      In 2015, Louisiana elected Democrat John Bel Edwards to be the governor. In the four years that he’s been in office, Louisiana’s population has shrunk amid out-migration and jobs disappearing. The state’s largest industry – oil and gas – is being sued out of the state by the governor’s allies, the trial lawyers. After promising to not raise taxes, he raised taxes (and when a sales tax was about to expire, he bullied the legislature into renewing a portion of it and called it a “tax cut”).

      He did raise teachers’ salaries though (by somewhere between $50-80 per month). He also eliminated the budget deficit (created by budgets he voted for as a legislator and using sales taxes he raised and claimed to have cut). So, there’s that.

      Louisiana could have done better in 2015, but the state’s GOP took for granted that Louisiana is a red state and assumed that three Republicans fighting each other wouldn’t be a problem. Then, Edwards won and Louisiana has suffered.`

    const words = content.match(/([a-zA-Z\'\’]+)/g);
    const mw = await DictionaryRepo.find({})
    let hasWords = []
    for(let word of words) {
      for (let w of mw) {
        if (w.word === word) {
          hasWords.push(w)
          break;
        }

      }
    }
    const wordSet = new Set(hasWords)
    hasWords = [...wordSet];
    console.log(hasWords)
    for (let word of hasWords) {
      const reg = new RegExp(`(${word.word})[\\s\\.]`);
      content = content.replace(reg, `
        <span class="word">
          <span class="translate">
            ${word.desc}
          </span>
          ${word.word}
        </span> 
      `)
    }

    return content;
  }
}
