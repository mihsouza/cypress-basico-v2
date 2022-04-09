beforeEach(function(){
    cy.visit('./src/privacy.html')
})
it('verifica o título da página de privacidade', function() {
    cy.title().should('be.equal', 'CAC TAT - Política de privacidade')
})