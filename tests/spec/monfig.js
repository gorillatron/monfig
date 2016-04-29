
import Promise        from 'bluebird';
import chai           from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path           from 'path';
import {build}        from '../../src/monfig';
import {inspect}      from 'util';

chai.should()
chai.use(chaiAsPromised);


describe('monfig', () => {

  describe('build()', () => {

    it('should merge configs like this', () => {

      let dev = build({
        debug: true,
        env: 'development',
        basePath: path.join(__dirname, '../test_config_fs/merge')
      })

      let prod = build({
        debug: true,
        env: 'production',
        basePath: path.join(__dirname, '../test_config_fs/merge')
      })


      return Promise.all([

        dev.should.eventually.deep.equal({
          "conf": {
            "confkey": "CONF",
            "devkey": "DEV",
            "prodkey": "CONF",
            "localkey": "LOCAL"
          }
        }),

        prod.should.eventually.deep.equal({
          "conf": {
            "confkey": "CONF",
            "devkey": "CONF",
            "prodkey": "PROD",
            "localkey": "LOCAL"
          }
        })

      ])
    })

  })

})
