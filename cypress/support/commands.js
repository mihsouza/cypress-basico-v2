const nome = 'Michele'
const sobrenome = 'Souza'
const email = 'michele@email.com'
const emailInvalido = 'email.com'
const longText = 'Testando minha primeira aplicação usando cypress. Preenchendo um campo de texto com um texto grande para utilizar o delay'

Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type(nome)
    cy.get('#lastName').type(sobrenome)
    cy.get('#email').type(email)
    cy.get('#open-text-area').type(longText, {delay: 0})
    cy.contains('button', 'Enviar').click()
})