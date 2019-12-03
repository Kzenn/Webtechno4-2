import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'


export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any 

  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
  public getAll(
    callback: (err: Error | null, result: any) => void)
  {
    let metrics : Metric[] = []
    this.db.createReadStream()
  .on('data', function (data) {
    console.log(data.key, '=', data.value)
    let timestamp : string = data.key.split(':')[1]
    let metric : Metric = new Metric(timestamp , data.value)
    metrics.push(metric)
  })
  .on('error', function (err) {
    callback(err, null)
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    callback(null, metrics)
    console.log('Stream ended')
    
  })
  }

  public getOne(key : string,
    callback: (err: Error | null, result: any) => void)
  {
    let metrics : Metric[] = []
    this.db.createReadStream()
  .on('data', function (data) {
    console.log(data.key, '=', data.value)
    let timestamp : string = data.key.split(':')[1]
    if(key == timestamp){
      let timet : string = data.key.split(':')[2]
      let metric : Metric = new Metric(timet, data.value)
      metrics.push(metric)
    } 
  })
  .on('error', function (err) {
    callback(err, null)
    console.log('Oh my!', err)
  })
  .on('close', function () {
    console.log('Stream closed')
  })
  .on('end', function () {
    callback(null, metrics)
    console.log('Stream ended')
    
  })
  }


  public erase(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db, {type : 'del'})
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }
}

