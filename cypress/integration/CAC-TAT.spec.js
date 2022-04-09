/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const nome = 'Michele'
    const sobrenome = 'Souza'
    const email = 'michele@email.com'
    const emailInvalido = 'email.com'
    const longText = 'Testando minha primeira aplicação usando cypress. Preenchendo um campo de texto com um texto grande para utilizar o delay'

    beforeEach(function(){
        cy.visit('./src/index.html')
    })
    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })
    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.clock()
        cy.get('#firstName').type(nome)
        cy.get('#lastName').type(sobrenome)
        cy.get('#email').type(email)
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.success').should('be.visible') //.success identifica que é uma classse

        cy.tick(3000)
        cy.get('.success').should('not.be.visible')
    })
    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.clock() //congela o relógio do navegador
        cy.get('#firstName').type(nome)
        cy.get('#lastName').type(sobrenome)
        cy.get('#email').type(emailInvalido)
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    Cypress._.times(3, function() {
        it('Campo de telefone continua vazio se não preenchido com valor numérico', function() {
            cy.get('#phone').type('abc').should('have.value', '')
        })
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.clock()
        cy.get('#firstName').type(nome)
        cy.get('#lastName').type(sobrenome)
        cy.get('#email').type(email)
        cy.get('#phone-checkbox').check()
        cy.get('#open-text-area').type(longText, {delay: 0})
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })
    it('preenche e limpa os campos nome, sobrenome, email e telefone', function() {
        cy.get('#firstName').type(nome).should('have.value', nome).clear().should('have.value', '')
        cy.get('#lastName').type(sobrenome).should('have.value', sobrenome).clear().should('have.value', '')
        cy.get('#email').type(email).should('have.value', email).clear().should('have.value', '')
        cy.get('#open-text-area').type(longText, {delay: 0}).should('have.value', longText).clear().should('have.value', '')
    })
    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function() {
        cy.clock()
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')

        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })
    //Exemplo com um comando customizado, melhor para centralizar o código e evitar de ficar diferente em vários lugares
    //Ver novamente a aula 16 para ver como passar variável
    it('envia o formuário com sucesso usando um comando customizado', function() {
        cy.clock()
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')

        cy.tick(3000) //avança em 3 segundos
        cy.get('.success').should('not.be.visible')
    })
    it('seleciona um produto (YouTube) por seu texto', function() {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })
    it('seleciona um produto (Mentoria) por seu valor (value)', function() {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })
    it('seleciona um produto (Blog) por seu índice', function() {
        cy.get('#product').select(1).should('have.value', 'blog')
    })
    it('marca o tipo de atendimento "Feedback"', function() {
        cy.get('input[type="radio"][value="feedback"').check().should('have.value', 'feedback')
    })
    it('marca cada tipo de atendimento', function() {
        cy.get('input[type="radio"]')
          .should('have.length', 3)
          .each(function($radio){
              cy.wrap($radio).check()
              cy.wrap($radio).should('be.checked')
          })
    })
    it('marca ambos checkboxes, depois desmarca o último', function() {
        cy.get('input[type="checkbox"]')
          .check()
          .last()
          .uncheck()
          .should('not.be.checked')
    })
    it('seleciona um arquivo da pasta fixtures', function() {
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('seleciona um arquivo simulando um drag-and-drop', function() {
        cy.get('#file-upload')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function() {
        cy.fixture('example.json').as('simpleFile')
        cy.get('#file-upload')
        .selectFile('@simpleFile')
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function() {
        cy.get('a').should('have.attr', 'target', '_blank')
    })
    it('acessa a página da política de privacidade removendo o target e então clicanco no link', function() {
        cy.get('a')
          .invoke('removeAttr', 'target')
          .click()

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      it('preenche o campo de texto usando o .invoke', function() {
        const longText = Cypress._.repeat('0123456789', 20)
        cy.get('#open-text-area').invoke('val', longText).should('have.value', longText)
      })

      it('faz uma requisição HTTP', function(){
          cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html')
            .should(function(response){
                const {status, statusText, body} = response
                expect(status).to.equal(200)
                expect(statusText).to.equal('OK')
                expect(body).to.include('CAC TAT')
            })
      })

      it.only('encontra o gato escondido na aplicação', function(){
          cy.get('#cat').invoke('show').should('be.visible')
          cy.get('#title').invoke('text', 'CAT TAT')
      })

})

