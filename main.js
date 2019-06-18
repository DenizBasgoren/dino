
let durum = 'Baslamadi' // 'Basladi', 'Bitti'
let dinoResimleri = {
    dur: [],
    kos: [],
    zipla: [],
    egil: [],
    ol: []
}

let kusResimleri
let kaktusResimleri = []
let toprakResmi
let dekorasyonResimleri = []
let colResmi

let olmeSesi, ziplamaSesi, muzik
let skor = 0, rekor

localforage.getItem('rekor', function(err, veri) {
    if (veri) {
        rekor = veri
    }
    else {
        rekor = 0

        localforage.setItem('rekor', 0, function(err) {} )
    }
})

let dino = {
    x: 1/8,
    y: 6.6/8,
    vx: 0,
    vy: 0,
    durum: 'Dur', // 'Kos', 'Zipla', 'Egil', 'Ol'
    kare: 0
}

let kuslar = [ {x: 1.5, y: .75, v: 0, kare: 0}] // kus: { x, y, v, kare }
let kaktusler = [ {x: .8, tur: 0}] // kaktus: { x, tur }
let dekorasyonlar = [] // dekorasyon: { x, tur }


function preload() {
    for (let i = 1; i<=10; i++) {
        dinoResimleri.dur.push( loadImage(`gorsel/Dur (${i}).png`))
        dinoResimleri.dur.push( loadImage(`gorsel/Dur (${i}).png`))
        dinoResimleri.dur.push( loadImage(`gorsel/Dur (${i}).png`))

    }

    for (let i = 1; i<=8; i++) {
        dinoResimleri.kos.push( loadImage(`gorsel/Kos (${i}).png`))
        dinoResimleri.kos.push( loadImage(`gorsel/Kos (${i}).png`))
        dinoResimleri.kos.push( loadImage(`gorsel/Kos (${i}).png`))

    }

    for (let i = 1; i<=12; i++) {
        dinoResimleri.zipla.push( loadImage(`gorsel/Zipla (${i}).png`))
        dinoResimleri.zipla.push( loadImage(`gorsel/Zipla (${i}).png`))
        dinoResimleri.zipla.push( loadImage(`gorsel/Zipla (${i}).png`))

    }

    for (let i = 1; i<=2; i++) {
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))
        dinoResimleri.egil.push( loadImage(`gorsel/Egil (${i}).png`))

    }
    
    dinoResimleri.ol.push( loadImage(`gorsel/Ol (1).png`))

    kusResimleri = loadImage('gorsel/Kus.png')
    
    for (let i = 1; i<=3; i++) {
        kaktusResimleri.push( loadImage(`gorsel/Kaktus (${i}).png`))
    }

    toprakResmi = loadImage(`gorsel/Toprak.png`)
    

    for (let i = 1; i<=3; i++) {
        dekorasyonResimleri.push( loadImage(`gorsel/Dekorasyon (${i}).png`))
    }

    colResmi = loadImage('gorsel/Col.png')
}


function setup() {
    createCanvas(windowWidth, windowHeight)
    textAlign(CENTER, CENTER)
    textSize(30)
    // frameRate(20)
}

function draw() {
    arkaplaniCiz()
    skoruCiz()
    translate((1/8-dino.x)*width, 0)
    dinoyuCiz()
    kaktusleriCiz()
    kuslariCiz()
    dekorasyonuCiz()
    topragiCiz()
    oyunuGuncelle()
    dinoyuGuncelle()
    kuslariGuncelle()
    carpismalariKontrolEt()
}

function arkaplaniCiz() {
    for (let i = -skor/40 % height * 4/3; i < width; i+= height * 4/3) {
        image(colResmi, i, 0, height * 4/3, height)
    }
}

function dinoyuCiz() {
    let resimler

    if (dino.durum == 'Dur') {
        resimler = dinoResimleri.dur
    }
    else if (dino.durum == 'Kos') {
        resimler = dinoResimleri.kos
    }
    else if (dino.durum == 'Zipla') {
        resimler = dinoResimleri.zipla
    }
    else if (dino.durum == 'Egil') {
        resimler = dinoResimleri.egil
    }
    else {
        resimler = dinoResimleri.ol
    }

    let boy = height * 1/8
    let en = boy * 70/50
    image(resimler[ dino.kare ], dino.x*width, dino.y*height, en, boy )

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}

function dinoyuGuncelle() {

    let kareSayisi = {
        Dur: 30,
        Kos: 24,
        Zipla: 36,
        Egil: 12,
        Ol: 1
    }


    dino.kare++
    dino.kare = dino.kare % kareSayisi[ dino.durum ]

    dino.x += dino.vx
    dino.y += dino.vy

    if (durum == 'Basladi') {
        dino.vx += .000001
    }

    dino.vy += .00066

    if (dino.y > 6.6/8 ) {
        dino.y = 6.6/8
        dino.vy = 0
    }

    
}

function oyunuGuncelle() {

    let yukariBasildi = keyIsPressed && (key == 'ArrowUp' || key == ' ' ) || mouseIsPressed && mouseY < height/2
    let asagiBasildi = keyIsPressed && key == 'ArrowDown' || mouseIsPressed && mouseY > height/2

    if (durum == 'Baslamadi') {

        if ( yukariBasildi && dino.durum == 'Dur') {
            dino.kare = 0
            dino.durum = 'Zipla'
            dino.vy = -.02

            if (!olmeSesi || !ziplamaSesi || !muzik) {
                olmeSesi = new Howl({
                    src: ['isitsel/Ol.mp3']
                })
                ziplamaSesi = new Howl({
                    src: ['isitsel/Zipla.mp3'],
                    autoplay: true
                })
                muzik = new Howl({
                    src: ['isitsel/Prehistorik.mp3'],
                    autoplay: true,
                    loop: true
                })
            }
        }
        else if (dino.durum == 'Zipla' && dino.vy == 0) {
            dino.kare = 0
            dino.durum = 'Kos'
            durum = 'Basladi'
            dino.vx = .005
        }
    }
    else if (durum == 'Basladi') {

        skor++
        if (skor > rekor) {
            rekor = skor
        }

        if (dino.durum == 'Zipla' && dino.vy == 0) {
            dino.kare = 0
            dino.durum = 'Kos'
        }
        else if ( yukariBasildi && dino.durum == 'Kos') {
            dino.kare = 0
            dino.durum = 'Zipla'
            dino.vy = -.02
            ziplamaSesi.play()
        }
        else if (asagiBasildi && dino.durum == 'Kos') {
            dino.kare = 0
            dino.durum = 'Egil'
            ziplamaSesi.play()
        }
        else if (!asagiBasildi && dino.durum == 'Egil') {
            dino.kare = 0
            dino.durum = 'Kos'
        }

        if (Math.random()<.01 &&
        dino.x - kaktusler[kaktusler.length-1].x > .5 &&
        dino.x - kuslar[kuslar.length-1].x > .5) {
            kaktusler.push( {
                x: dino.x + 1,
                tur: Math.floor( Math.random()*3 )
            })
        }

        if (Math.random()<.01 &&
        dino.x - kaktusler[kaktusler.length-1].x > .5 &&
        dino.x - kuslar[kuslar.length-1].x > .5) {

            let yDegerleri = [.6, .65, .7, .75]
            let secilenY = yDegerleri[ Math.floor(Math.random()*4) ]

            kuslar.push( {
                x: dino.x + 1,
                y: secilenY,
                v: -Math.random() * .005,
                kare: 0
            })
        }

        if (Math.random()<.01) {
            dekorasyonlar.push( {
                x: dino.x + 1,
                tur: Math.floor( Math.random() * 2)
            })
        }
    }
    else if (durum == 'Bitti') {
        dino.kare = 0
        dino.durum = 'Ol'
        dino.vx = 0
        dino.vy = 0

        
        if (skor == rekor) {
            localforage.setItem('rekor', rekor, function(err) {})
        }

        if (yukariBasildi || asagiBasildi) {
            durum = 'Baslamadi'

            skor = 0
            keyIsPressed = false

            dino = {
                x: 1/8,
                y: 6.6/8,
                vx: 0,
                vy: 0,
                durum: 'Dur', // 'Kos', 'Zipla', 'Egil', 'Ol'
                kare: 0
            }

            kuslar = [ {x: 1.5, y: .75, v: 0, kare: 0}] // kus: { x, y, v, kare }
            kaktusler = [ {x: .8, tur: 0}] // kaktus: { x, tur }
            dekorasyonlar = [] // dekorasyon: { x, tur }
        }
    }
}

function kaktusleriCiz() {
    for (let i = 0; i<kaktusler.length; i++) {
        if (kaktusler[i].x > dino.x - 2/8 && kaktusler[i].x < dino.x + 1) {
            if (kaktusler[i].tur == 0) {
                image(kaktusResimleri[0],
                    kaktusler[i].x*width,
                    6/8 * height,
                    1.5/8 * height * 2/3,
                    1.5/8 * height)
            }
            else if (kaktusler[i].tur == 1) {
                image(kaktusResimleri[1],
                    kaktusler[i].x*width,
                    6.8/8 * height,
                    0.7/8 * height * 3/2,
                    0.7/8 * height)
            }
            else {
                image(kaktusResimleri[2],
                    kaktusler[i].x*width,
                    6/8 * height,
                    1.5/8 * height,
                    1.5/8 * height)
            }
        }
    }
}

function kuslariCiz() {

    for (let i = 0; i<kuslar.length; i++) {
        if (kuslar[i].x > dino.x - 2/8 && kuslar[i].x < dino.x + 1) {
            image(kusResimleri, kuslar[i].x*width, kuslar[i].y*height, height/10 * 3/2, height/10,
                kuslar[i].kare * 64 + 16 ,8,48,40
                )
        }
    }
}

function kuslariGuncelle() {

    let sonkus = kuslar[kuslar.length-1]

    if (frameCount % 3 == 0) {

        sonkus.kare++
        sonkus.kare = sonkus.kare % 9
    
    }
    sonkus.x += sonkus.v

}

function topragiCiz() {
    let i = dino.x - 1/8 - (dino.x - 1/8) % (height * 0.5/8 / width)
    for ( ; i < (dino.x + 7/8); i+= height * 0.5/8 / width) {
        image(toprakResmi, i * width, height * 7.5/8, height * 0.5/8, height * 0.5/8)
    }
}

function dekorasyonuCiz() {
    for (let i = 0; i<dekorasyonlar.length; i++) {
        if (dekorasyonlar[i].x > dino.x - 2/8 && dekorasyonlar[i].x < dino.x + 1) {
            image(dekorasyonResimleri[ dekorasyonlar[i].tur ],
                dekorasyonlar[i].x*width,
                7.3/8 * height,
                0.2/8 * height * 2,
                0.2/8 * height)
        }
    }
}

function skoruCiz() {
    text(`HI ${rekor}, ${skor}`, width * 6.5/8, height * 1/16)
}

function carpismalariKontrolEt() {
    let x1, y1, w1, h1, x2, y2, w2, h2

    if (durum != 'Basladi') {
        return
    }

    if (dino.durum != 'Egil') {
        x1 = dino.x * width
        y1 = dino.y * height
        w1 = height * 1/8 * 4/5
        h1 = height * 1/8
    }
    else {
        x1 = dino.x * width + height * 1/8 * 7/5 * 1/7
        y1 = dino.y * height + height * 1/8 * 1/2
        w1 = height * 1/8 * 7/5 * 6/7
        h1 = height * 1/8 * 2/5
    }

    for (let i = 0; i < kuslar.length; i++) {
        x2 = kuslar[i].x * width
        y2 = kuslar[i].y * height
        w2 = height/10 * 3/2
        h2 = height/10

        if (collideRectRect(x1,y1,w1,h1,x2,y2,w2,h2)) {
            durum = 'Bitti'
            olmeSesi.play()
            return
        }
    }

    for (let i = 0; i< kaktusler.length; i++) {
        if (kaktusler[i].tur == 0) {
            x2 = kaktusler[i].x*width
            y2 = 6/8 * height
            w2 = 1.5/8 * height * 2/3
            h2 = 1.5/8 * height
        }
        else if (kaktusler[i].tur == 1) {
            x2 = kaktusler[i].x*width
            y2 = 6.8/8 * height
            w2 = 0.7/8 * height * 3/2
            h2 = 0.7/8 * height
        }
        else {
            x2 = kaktusler[i].x*width
            y2 = 6/8 * height
            w2 = 1.5/8 * height
            h2 = 1.5/8 * height
        }

        if (collideRectRect(x1,y1,w1,h1,x2,y2,w2,h2)) {
            durum = 'Bitti'
            olmeSesi.play()
            return
        }
    }

}


/*

-arkaplaniCiz
-skoruCiz
-dinoyuCiz
-kuslariCiz
-topragiCiz
-kaktusleriCiz
-otuCiz


-dinoyuGuncelle
-oyunuGuncelle
-kuslariGuncelle
-skoruGuncelle

*/