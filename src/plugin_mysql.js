// plugin_mysql.js
const mysql = require('mysql')
const ERR_OPEN_DB = 'MySQLの命令を使う前に『MYSQL開く』でデータベースを開いてください。';
const ERR_ASYNC = '『逐次実行』構文で使ってください。';
const PluginMYSQL = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__mysql_db = null
    }
  },
  // @MySQL
  'MYSQL開': { // @データベースを開く // @MYSQLひらく
    type: 'func',
    josi: [['を', 'の', 'で']],
    fn: function (s, sys) {
        const db = mysql.createConnection(s)
        sys.__mysql_db = db
        db.connect()
    }
  },
  'MYSQL閉': { // @データベースを閉じる // @MYSQLとじる
    type: 'func',
    josi: [],
    fn: function (sys) {
        sys.__mysql_db.end()
    }
  },
  'MYSQL逐次実行': { // @逐次実行構文にて、SQLとパラメータPARAMSでSQLを実行し、変数『対象』に結果を得る。INSERT句の場合は『対象[insertId]』でIDが得られる。 // @MYSQLちくじじっこう
    type: 'func',
    josi: [['を'], ['で']],
    fn: function (sql, params, sys) {
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      if (!sys.__mysql_db) throw new Error(ERR_OPEN_DB)
      sys.__mysql_db.query(sql, params, function (err, rows) {
        if (err) {
          throw new Error('MYSQL逐次実行のエラー『' + sql + '』' + err.message)
        }
        sys.__v0['対象'] = rows
        resolve()
      })
    },
    return_none: true
  }
}

module.exports = PluginMYSQL

