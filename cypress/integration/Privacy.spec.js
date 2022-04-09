beforeEach(function(){
    cy.visit('./src/privacy.html')
})
it('verifica o título da página de privacidade', function() {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
})