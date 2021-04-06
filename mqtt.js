const mqtt = require('mqtt')
const cliente = mqtt.connect({ host: 'localhost', port: 1883, keepalive: 18000 })
let msg = { s: '', us: '', a: '' }, ini, itp = 0, acc = 0, total = 0

texto = (tam) => {
    let t = '', c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < tam; i++)
        t += c.charAt(Math.floor(Math.random() * c.length))
    return t
}

const qds = 0 //QoS
const tam = 4096 //Bytes
const tempo_loop = 5 //S

msg.a = texto(tam - 39)
const exps = [
    { reset: '1', itp: 0, nome_arquivo: 'qos' + qds + '_' + tam + 'b0ms_1.csv' },
    { reset: '1', itp: 0, nome_arquivo: 'qos' + qds + '_' + tam + 'b0ms_2.csv' },
    { reset: '1', itp: 0, nome_arquivo: 'qos' + qds + '_' + tam + 'b0ms_3.csv' },

    { reset: '1', itp: 20, nome_arquivo: 'qos' + qds + '_' + tam + 'b20ms_1.csv' },
    { reset: '1', itp: 20, nome_arquivo: 'qos' + qds + '_' + tam + 'b20ms_2.csv' },
    { reset: '1', itp: 20, nome_arquivo: 'qos' + qds + '_' + tam + 'b20ms_3.csv' },

    { reset: '1', itp: 40, nome_arquivo: 'qos' + qds + '_' + tam + 'b40ms_1.csv' },
    { reset: '1', itp: 40, nome_arquivo: 'qos' + qds + '_' + tam + 'b40ms_2.csv' },
    { reset: '1', itp: 40, nome_arquivo: 'qos' + qds + '_' + tam + 'b40ms_3.csv' },

    { reset: '1', itp: 60, nome_arquivo: 'qos' + qds + '_' + tam + 'b60ms_1.csv' },
    { reset: '1', itp: 60, nome_arquivo: 'qos' + qds + '_' + tam + 'b60ms_2.csv' },
    { reset: '1', itp: 60, nome_arquivo: 'qos' + qds + '_' + tam + 'b60ms_3.csv' },

    { reset: '1', itp: 80, nome_arquivo: 'qos' + qds + '_' + tam + 'b80ms_1.csv' },
    { reset: '1', itp: 80, nome_arquivo: 'qos' + qds + '_' + tam + 'b80ms_2.csv' },
    { reset: '1', itp: 80, nome_arquivo: 'qos' + qds + '_' + tam + 'b80ms_3.csv' },

    { reset: '1', itp: 100, nome_arquivo: 'qos' + qds + '_' + tam + 'b100ms_1.csv' },
    { reset: '1', itp: 100, nome_arquivo: 'qos' + qds + '_' + tam + 'b100ms_2.csv' },
    { reset: '1', itp: 100, nome_arquivo: 'qos' + qds + '_' + tam + 'b100ms_3.csv' },
]

cliente.on('connect', () => {
    console.log('Cliente Conectado')
    loop_envio()
})

loop_envio = () => {
    total = 0
    setTimeout(() => {
        itp = exps[acc].itp
        cliente.publish('0', JSON.stringify(exps[acc]), { qos: qds })
        setTimeout(() => {
            ini = (new Date().getTime() / 1000)
            enviar_dados()
        }, 5000)
    }, 5000)
}

enviar_dados = () => {
    let t = String(new Date().getTime() / 1000)
    msg.s = t.split('.')[0]
    msg.us = t.split('.')[1] + '000'
    cliente.publish('0', JSON.stringify(msg), { qos: qds })
    total++
    if (((new Date().getTime() / 1000) - ini) <= tempo_loop)
        setTimeout(enviar_dados, itp)
    else {
        cliente.publish('0', JSON.stringify({ fim: '1', total: total }), { qos: qds })
        acc++
        if (exps[acc]) loop_envio()
        else console.log('! ! ! FIM ! ! !');
    }
    // console.log(msg)
}