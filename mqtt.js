var mqtt = require('mqtt')
var cliente = mqtt.connect({ host: 'localhost', port: 1883, keepalive: 18000 })
let now = { s: '', us: '', a: '' }
let ini, total = 0

texto = (tam) => {
    let t = '', c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < tam; i++)
        t += c.charAt(Math.floor(Math.random() * c.length))
    return t
}

now.a = texto(4096 - 39) //Bytes
let itp = 0 //Ms
let tempo_loop = 60 //S
let qds = 0 //QoS

cliente.on('connect', () => {
    console.log('Cliente Conectado')
    ini = (new Date().getTime() / 1000)
    enviar_dados()
})

enviar_dados = () => {
    let t = String(new Date().getTime() / 1000)
    now.s = t.split('.')[0]
    now.us = t.split('.')[1] + '000'
    cliente.publish('0', JSON.stringify(now), { qos: qds })
    total++
    if (((new Date().getTime() / 1000) - ini) <= tempo_loop)
        setTimeout(enviar_dados, itp)
    // if (total < 4)
    // setTimeout(enviar_dados, 1000)
    else
        cliente.publish('0', JSON.stringify({ fim: '1', total: total }), { qos: qds })
    console.log(now)
}

//enviar_dados()