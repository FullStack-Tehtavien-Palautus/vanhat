describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })
  
  it('Login form is shown', function() {
    cy.contains('login').click()
    cy.contains('Please, log in:')    
  })
  
  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('ereponen')
      cy.get('input[name="Password"]').type('salakka')
      cy.get('button[type="submit"]').click()
      cy.contains('Esko Rauno Reponen')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('root')
      cy.get('input[name="Password"]').type('root')
      cy.get('button[type="submit"]').click()
      cy.contains('Please, log in:')
    })
  })
  
  describe('When logged in', function() {
    beforeEach(function() {
      cy.contains('login').click()
      cy.get('input[name="Username"]').type('ereponen')
      cy.get('input[name="Password"]').type('salakka')
      cy.get('button[type="submit"]').click()
    })

    it('A blog can be created', function() {
      cy.contains('add blog').click()
      cy.get('input[name="Title"]').type('Paha paha blogi')
      cy.get('input[name="Author"]').type('Annika Loppinen')
      cy.get('input[name="Url"]').type('gopher://pahaolo.fi/1pahapaha')
      cy.get('button[type="submit"]').click()
      cy.contains('cancel').click()
      cy.contains('Paha paha blogi')
    })

    it('A blog can be liked', function() {
      cy.contains('add blog').click()
      cy.get('input[name="Title"]').type('Paha paha blogi')
      cy.get('input[name="Author"]').type('Annika Loppinen')
      cy.get('input[name="Url"]').type('gopher://pahaolo.fi/1pahapaha')
      cy.get('button[type="submit"]').click()
      cy.contains('Annika Loppinen').contains('show').click()
      cy.contains('Annika Loppinen').parent().contains('like').click()
      cy.contains('Annika Loppinen').parent().contains('likes 1')
    })

    it('Blogs are sorted by likes', function() {
      cy.contains('add blog').click()
      cy.get('input[name="Title"]').type('Paha paha blogi')
      cy.get('input[name="Author"]').type('Annika Loppinen')
      cy.get('input[name="Url"]').type('gopher://pahaolo.fi/1pahapaha')
      cy.get('button[type="submit"]').click()
      cy.contains('Annika Loppinen').contains('show').click()
      cy.contains('Annika Loppinen').parent()
        .contains('like').click().parent().contains('likes 1')

      cy.get('input[name="Title"]').type('Avaruus')
      cy.get('input[name="Author"]').type('Eino M Kolari')
      cy.get('input[name="Url"]').type('http://sitebuilder.org/avaruus_official')
      cy.get('button[type="submit"]').click()
      cy.contains('Eino M Kolari').contains('show').click()
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 1')
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 2')
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 3')
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 4')
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 5')
      cy.contains('Eino M Kolari').parent()
        .contains('like').click().parent().contains('likes 6')
        
      cy.get('input[name="Title"]').type('Hyvä hyvä plogi')
      cy.get('input[name="Author"]').type('Saana Matilainen')
      cy.get('input[name="Url"]').type('http://fbcdn.net/blog553')
      cy.get('button[type="submit"]').click()
      cy.contains('Saana Matilainen').contains('show').click()
      cy.contains('Saana Matilainen').parent()
        .contains('like').click().parent().contains('likes 1')
      cy.contains('Saana Matilainen').parent()
        .contains('like').click().parent().contains('likes 2')
      cy.contains('Saana Matilainen').parent()
        .contains('like').click().parent().contains('likes 3')

      cy.get('.blogBox').then( blogs => {
        cy.wrap(blogs[0]).contains('likes 6')
        cy.wrap(blogs[1]).contains('likes 3')
        cy.wrap(blogs[2]).contains('likes 1')
      })
    })
  })

})