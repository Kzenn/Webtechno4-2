import { expect } from 'chai'
import { Metric, MetricsHandler } from './metrics'
import { LevelDB } from "./leveldb"

const dbPath: string = 'db_test'
var dbMet: MetricsHandler

describe('Metrics', function () {
  before(function () {
    LevelDB.clear(dbPath)
    dbMet = new MetricsHandler(dbPath)
  })

  describe('#get1', function () {
    it('Should get empty array on non existing group', function (next) {
      dbMet.getOne("0", function (err: Error | null, result?: Metric[]) {
        expect(err).to.be.null
        expect(result).to.not.be.undefined
        expect(result).to.be.empty
        next()
      })
    })
  })

  describe('#save',function(){
      it('Should save data',function(next){
          var met: Metric[]=[]
          met.push(new Metric("121213",10))
          dbMet.save(1,met,(err: Error | null) => {
            if (err) throw err
            dbMet.getOne("1", function (err: Error | null, result: Metric[]) {
              expect(err).to.be.null
              expect(result).to.not.be.empty
              expect(result).to.not.be.undefined
              if (result){
                expect(result[0].value).to.equal(10)
                next()
              }
            })
          })
      })
      it('Should update data',function(next){
        var met: Metric[]=[]
        met.push(new Metric("121213",15))
        dbMet.save(1,met,(err: Error | null) => {
          if (err) throw err
          dbMet.getOne("1", function (err: Error | null, result: Metric[]) {
            expect(err).to.be.null
            expect(result).to.not.be.empty
            expect(result).to.not.be.undefined
            if (result){
              expect(result[0].value).to.equal(15)
              next()
            }
          })
        })
    })
  })

  describe('#delete',function(){
    it('Should delete data',function(next){
      var met: Metric[]=[]
      met.push(new Metric("121213",10))
      dbMet.save(1,met,(err: Error | null) => {
        if (err) throw err
        dbMet.erase(1,met,(err: Error | null) => {
          if (err) throw err
          dbMet.getOne("1", function (err: Error | null, result: Metric[]) {
            expect(err).to.be.null
            expect(result).to.be.empty
            next()
          })
        })
      })
      
    })
    it('Should not fail if data does not exist',function(next){
      var met: Metric[]=[]
      met.push(new Metric("121213",10))
      dbMet.save(1,met,(err: Error | null) => {
        if (err) throw err
        dbMet.erase(2,met,(err: Error | null) => {
          expect(err).to.be.undefined
          next()
        })
      })
      
    })
  })

  
})