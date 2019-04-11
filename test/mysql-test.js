const assert = require('assert')
const path = require('path')
const nadesiko3 = require('nadesiko3')
const NakoCompiler = nadesiko3.compiler
const PluginNode = nadesiko3.PluginNode
const PluginMSSQL = require('../src/plugin_mysql.js')
const config = require('../db_config.js') // MYSQL接続文字列を返すようにする
const assert_func = (a, b) => { assert.equal(a, b) }

describe('mysql_test', () => {
  const nako = new NakoCompiler()
  nako.addPluginObject('PluginNode', PluginNode)
  nako.addPluginObject('PluginMSSQL', PluginMSSQL)
  // console.log(nako.gen.plugins)
  // nako.debug = true
  nako.setFunc('テスト', [['と'], ['で']], assert_func)
  const cmp = (code, res) => {
    if (nako.debug) {
      console.log('code=' + code)
    }
    assert.equal(nako.runReset(code).log, res)
  }
  const cmd = (code) => {
    if (nako.debug) console.log('code=' + code)
    nako.runReset(code)
  }
  // --- test ---
  it('表示', () => {
    cmp('3を表示', '3')
  })
  // --- テスト ---
  it('MYSQL 作成', (done) => {
    global.done = done
    cmd(
      `『${config}』をMYSQL開く。\n` +
      '逐次実行\n' +
      '　次に、「CREATE TABLE tt (id BIGINT, value BIGINT);」を[]でMYSQL逐次実行\n' +
      '　次に、MYSQL閉じる。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  it('MYSQL 挿入', (done) => {
    global.done = done
    cmd(
      '逐次実行\n' +
      `　先に、『${config}』をMYSQL開く。\n` +
      '　次に、「BEGIN」を[]でMYSQL逐次実行\n' +
      '　次に、「INSERT INTO tt (id, value)VALUES(1,321);」を[]でMYSQL逐次実行\n' +
      '　次に、「INSERT INTO tt (id, value)VALUES(?,?);」を[2,333]でMYSQL逐次実行\n' +
      '　次に、「INSERT INTO tt (id, value)VALUES(3,222);」を[]でMYSQL逐次実行\n' +
      '　次に、「COMMIT」を[]でMYSQL逐次実行\n' +
      '　次に、MYSQL閉じる。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  it('MYSQL 抽出', (done) => {
    global.done = done
    cmd(
      '逐次実行\n' +
      `　先に、『${config}』をMYSQL開く。\n` +
      '　次に、「SELECT * FROM tt ORDER BY id ASC」を[]でMYSQL逐次実行\n' +
      '　次に、対象[1]["value"]と333でテスト。\n' +
      '　次に、MYSQL閉じる。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
  it('MYSQL 削除', (done) => {
    global.done = done
    cmd(
      '逐次実行\n' +
      `　先に、『${config}』をMYSQL開く。\n` +
      '　次に、「DROP TABLE tt」を[]でMYSQL逐次実行\n' +
      '　次に、MYSQL閉じる。\n' +
      '　次に、JS{{{ global.done() }}}\n' +
      'ここまで\n'
    )
  })
})
