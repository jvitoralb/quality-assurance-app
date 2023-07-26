const chai = require('chai')


const assert = chai.assert

suite('Unit Tests', async function() {
    const Translator = (await import('../service/services.js')).default

    suite('Unit Tests - Translate to British English', function() {
        const translateToBritish = new Translator('american-to-british')
        test('#Mangoes are my favorite fruit.', function(done) {
            translateToBritish.textInput = 'Mangoes are my favorite fruit.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'Mangoes are my favorite fruit.',
                translation: 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.'
            })
            done()
        })
        test('#I ate yogurt for breakfast.', function(done) {
            translateToBritish.textInput = 'I ate yogurt for breakfast.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'I ate yogurt for breakfast.',
                translation: 'I ate <span class=\"highlight\">yoghurt</span> for breakfast.'
            })
            done()
        })
        test('#We had a party at my friend\'s condo.', function(done) {
            translateToBritish.textInput = 'We had a party at my friend\'s condo.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'We had a party at my friend\'s condo.',
                translation: 'We had a party at my friend\'s <span class=\"highlight\">flat</span>.'
            })
            done()
        })
        test('#Can you toss this in the trashcan for me?', function(done) {
            translateToBritish.textInput = 'Can you toss this in the trashcan for me?'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'Can you toss this in the trashcan for me?',
                translation: 'Can you toss this in the <span class=\"highlight\">bin</span> for me?'
            })
            done()
        })
        test('#The parking lot was full.', function(done) {
            translateToBritish.textInput = 'The parking lot was full.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'The parking lot was full.',
                translation: 'The <span class=\"highlight\">car park</span> was full.'
            })
            done()
        })
        test('#Like a high tech Rube Goldberg machine.', function(done) {
            translateToBritish.textInput = 'Like a high tech Rube Goldberg machine.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'Like a high tech Rube Goldberg machine.',
                translation: 'Like a high tech <span class=\"highlight\">Heath Robinson device</span>.'
            })
            done()
        })
        test('#To play hooky means to skip class or work.', function(done) {
            translateToBritish.textInput = 'To play hooky means to skip class or work.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'To play hooky means to skip class or work.',
                translation: 'To <span class=\"highlight\">bunk off</span> means to skip class or work.'
            })
            done()
        })
        test('#No Mr. Bond, I expect you to die.', function(done) {
            translateToBritish.textInput = 'No Mr. Bond, I expect you to die.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'No Mr. Bond, I expect you to die.',
                translation: 'No <span class=\"highlight\">Mr</span> Bond, I expect you to die.'
            })
            done()
        })
        test('#Dr. Grosh will see you now.', function(done) {
            translateToBritish.textInput = 'Dr. Grosh will see you now.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'Dr. Grosh will see you now.',
                translation: '<span class=\"highlight\">Dr</span> Grosh will see you now.'
            })
            done()
        })
        test('#Lunch is at 12:15 today.', function(done) {
            translateToBritish.textInput = 'Lunch is at 12:15 today.'
            assert.deepStrictEqual(translateToBritish.getTranslation(), {
                text: 'Lunch is at 12:15 today.',
                translation: 'Lunch is at <span class=\"highlight\">12.15</span> today.'
            })
            done()
        })
    })
    suite('Unit Tests - Translate to American English', function () {
        const translateToAmerican = new Translator('british-to-american')
        test('#We watched the footie match for a while.', function(done) {
            translateToAmerican.textInput = 'We watched the footie match for a while.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'We watched the footie match for a while.',
                translation: 'We watched the <span class=\"highlight\">soccer</span> match for a while.'
            })
            done()
        })
        test('#Paracetamol takes up to an hour to work.', function(done) {
            translateToAmerican.textInput = 'Paracetamol takes up to an hour to work.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'Paracetamol takes up to an hour to work.',
                translation: '<span class=\"highlight\">Tylenol</span> takes up to an hour to work.'
            })
            done()
        })
        test('#First, caramelise the onions.', function(done) {
            translateToAmerican.textInput = 'First, caramelise the onions.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'First, caramelise the onions.',
                translation: 'First, <span class=\"highlight\">caramelize</span> the onions.'
            })
            done()
        })
        test('#I spent the bank holiday at the funfair.', function(done) {
            translateToAmerican.textInput = 'I spent the bank holiday at the funfair.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'I spent the bank holiday at the funfair.',
                translation: 'I spent the <span class=\"highlight\">public holiday</span> at the <span class=\"highlight\">carnival</span>.'
            })
            done()
        })
        test('#I had a bicky then went to the chippy.', function(done) {
            translateToAmerican.textInput = 'I had a bicky then went to the chippy.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'I had a bicky then went to the chippy.',
                translation: 'I had a <span class=\"highlight\">cookie</span> then went to the <span class=\"highlight\">fish-and-chip shop</span>.'
            })
            done()
        })
        test('#I\'ve just got bits and bobs in my bum bag.', function(done) {
            translateToAmerican.textInput = 'I\'ve just got bits and bobs in my bum bag.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'I\'ve just got bits and bobs in my bum bag.',
                translation: 'I\'ve just got <span class=\"highlight\">odds and ends</span> in my <span class=\"highlight\">fanny pack</span>.'
            })
            done()
        })
        test('#The car boot sale at Boxted Airfield was called off.', function(done) {
            translateToAmerican.textInput = 'The car boot sale at Boxted Airfield was called off.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'The car boot sale at Boxted Airfield was called off.',
                translation: 'The <span class=\"highlight\">swap meet</span> at Boxted Airfield was called off.'
            })
            done()
        })
        test('#Have you met Mrs Kalyani?', function(done) {
            translateToAmerican.textInput = 'Have you met Mrs Kalyani?'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'Have you met Mrs Kalyani?',
                translation: 'Have you met <span class=\"highlight\">Mrs.</span> Kalyani?'
            })
            done()
        })
        test('#Prof Joyner of King\'s College, London.', function(done) {
            translateToAmerican.textInput = 'Prof Joyner of King\'s College, London.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'Prof Joyner of King\'s College, London.',
                translation: '<span class=\"highlight\">Prof.</span> Joyner of King\'s College, London.'
            })
            done()
        })
        test('#Tea time is usually around 4 or 4.30.', function(done) {
            translateToAmerican.textInput = 'Tea time is usually around 4 or 4.30.'
            assert.deepStrictEqual(translateToAmerican.getTranslation(), {
                text: 'Tea time is usually around 4 or 4.30.',
                translation: 'Tea time is usually around 4 or <span class=\"highlight\">4:30</span>.'
            })
            done()
        })
    })
    suite('Unit Tests - Highlight translation', function() {
        const translateToBritish = new Translator('american-to-british')
        test('#Mangoes are my favorite fruit.', function(done) {
            translateToBritish.textInput = 'Mangoes are my favorite fruit.'
            assert.strictEqual(translateToBritish.getTranslation().translation, 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.')
            done()
        })
        test('#I ate yogurt for breakfast.', function(done) {
            translateToBritish.textInput = 'I ate yogurt for breakfast.'
            assert.strictEqual(translateToBritish.getTranslation().translation, 'I ate <span class=\"highlight\">yoghurt</span> for breakfast.')
            done()
        })
        const translateToAmerican = new Translator('british-to-american')
        test('#We watched the footie match for a while.', function(done) {
            translateToAmerican.textInput = 'We watched the footie match for a while.'
            assert.strictEqual(translateToAmerican.getTranslation().translation, 'We watched the <span class=\"highlight\">soccer</span> match for a while.')
            done()
        })
        test('#Paracetamol takes up to an hour to work.', function(done) {
            translateToAmerican.textInput = 'Paracetamol takes up to an hour to work.'
            assert.strictEqual(translateToAmerican.getTranslation().translation, '<span class=\"highlight\">Tylenol</span> takes up to an hour to work.')
            done()
        })
    })
})