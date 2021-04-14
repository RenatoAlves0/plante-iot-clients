const coap = require('coap')

let msg = { s: '', us: '', a: '' }, ini, itp = 0, acc = 0, total = 0

texto = (tam) => {
    let t = '', c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < tam; i++)
        t += c.charAt(Math.floor(Math.random() * c.length))
    return t
}

//tam 57, 130, 203

const tam = 203 //Bytes
const tempo_loop = 60 //S

msg.a = texto(tam - 39)
const exps = [
    { reset: '1', itp: 0, nome_arquivo: 'qos0_' + tam + 'b0ms_0.csv' },
    { reset: '1', itp: 0, nome_arquivo: 'qos0_' + tam + 'b0ms_1.csv' },
    { reset: '1', itp: 0, nome_arquivo: 'qos0_' + tam + 'b0ms_2.csv' },
    { reset: '1', itp: 0, nome_arquivo: 'qos0_' + tam + 'b0ms_3.csv' },
    { reset: '1', itp: 10, nome_arquivo: 'qos0_' + tam + 'b10ms_1.csv' },
    { reset: '1', itp: 10, nome_arquivo: 'qos0_' + tam + 'b10ms_2.csv' },
    { reset: '1', itp: 10, nome_arquivo: 'qos0_' + tam + 'b10ms_3.csv' },
    { reset: '1', itp: 20, nome_arquivo: 'qos0_' + tam + 'b20ms_1.csv' },
    { reset: '1', itp: 20, nome_arquivo: 'qos0_' + tam + 'b20ms_2.csv' },
    { reset: '1', itp: 20, nome_arquivo: 'qos0_' + tam + 'b20ms_3.csv' },
    { reset: '1', itp: 40, nome_arquivo: 'qos0_' + tam + 'b40ms_1.csv' },
    { reset: '1', itp: 40, nome_arquivo: 'qos0_' + tam + 'b40ms_2.csv' },
    { reset: '1', itp: 40, nome_arquivo: 'qos0_' + tam + 'b40ms_3.csv' },
    { reset: '1', itp: 60, nome_arquivo: 'qos0_' + tam + 'b60ms_1.csv' },
    { reset: '1', itp: 60, nome_arquivo: 'qos0_' + tam + 'b60ms_2.csv' },
    { reset: '1', itp: 60, nome_arquivo: 'qos0_' + tam + 'b60ms_3.csv' },
    { reset: '1', itp: 80, nome_arquivo: 'qos0_' + tam + 'b80ms_1.csv' },
    { reset: '1', itp: 80, nome_arquivo: 'qos0_' + tam + 'b80ms_2.csv' },
    { reset: '1', itp: 80, nome_arquivo: 'qos0_' + tam + 'b80ms_3.csv' },
    { reset: '1', itp: 100, nome_arquivo: 'qos0_' + tam + 'b100ms_1.csv' },
    { reset: '1', itp: 100, nome_arquivo: 'qos0_' + tam + 'b100ms_2.csv' },
    { reset: '1', itp: 100, nome_arquivo: 'qos0_' + tam + 'b100ms_3.csv' },
    { reset: '1', itp: 1000, nome_arquivo: 'qos0_' + tam + 'b1000ms_1.csv' },
    { reset: '1', itp: 1000, nome_arquivo: 'qos0_' + tam + 'b1000ms_2.csv' },
    { reset: '1', itp: 1000, nome_arquivo: 'qos0_' + tam + 'b1000ms_3.csv' },
    { reset: '1', itp: 3000, nome_arquivo: 'qos0_' + tam + 'b3000ms_1.csv' },
    { reset: '1', itp: 3000, nome_arquivo: 'qos0_' + tam + 'b3000ms_2.csv' },
    { reset: '1', itp: 3000, nome_arquivo: 'qos0_' + tam + 'b3000ms_3.csv' },
    { reset: '1', itp: 5000, nome_arquivo: 'qos0_' + tam + 'b5000ms_1.csv' },
    { reset: '1', itp: 5000, nome_arquivo: 'qos0_' + tam + 'b5000ms_2.csv' },
    { reset: '1', itp: 5000, nome_arquivo: 'qos0_' + tam + 'b5000ms_3.csv' },
]

enviar_msg = (dados) => {
    let cliente = coap.request(
        {
            host: 'localhost',
            port: 5683,
            pathname: "/0",
            method: 'post',
            confirmable: 'false'
        })
    cliente.write(dados)
    cliente.end()
}

loop_envio = () => {
    total = 0
    setTimeout(() => {
        itp = exps[acc].itp
        enviar_msg(JSON.stringify(exps[acc]))
        setTimeout(() => {
            ini = (new Date().getTime() / 1000)
            enviar_dados()
        }, 10000)
    }, 10000)
}

enviar_dados = () => {
    let t = String(new Date().getTime() / 1000)
    msg.s = t.split('.')[0]
    msg.us = t.split('.')[1] + '000'
    enviar_msg(JSON.stringify(msg))
    total++
    if (((new Date().getTime() / 1000) - ini) <= tempo_loop)
        setTimeout(enviar_dados, itp)
    else {
        enviar_msg(JSON.stringify({ fim: '1', total: total }))
        acc++
        if (exps[acc]) loop_envio()
        else console.log('! ! ! FIM ! ! !')
    }
}

loop_envio()