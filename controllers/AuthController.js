const User = require('../models/User');
const UserGoogle = require('../models/UserGoogle');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login')
    }

    static register(req, res) {
        res.render ('auth/register')
    }

    static privacy(req, res) {
        res.render ('auth/privacy')
    }

    static async registerPost(req, res) {
        // async pois haverá interações com o banco

        const {name, email, password, confirmpassword} = req.body;

        //validação de senha
        if(password != confirmpassword) {
            req.flash('message', 'As senhas não conferem, tente novamente!')
            res.render('auth/register')

            return
        }

        //validação de existência do user
        const checkIfUserExists = await User.findOne({where: {email: email}});

        if(checkIfUserExists) {
            req.flash('message', 'O email já está em uso!')
            res.render('auth/register')
            return
        }

        //encriptação
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name,
            email,
            password: hashedPassword
        }

        try {
            const createdUser = await User.create(user)

            req.session.userid = createdUser.id
            
            req.flash('message', 'Cadastro realizado com sucesso!')
        
            req.session.save(() => {
                res.redirect('/')
            })

        } catch(err) {
            console.log(err)
        }

    }

    static logout(req, res) {
        req.session.destroy()
        res.redirect('/login')
    }

    static async loginPost(req, res) {

        const {email, password} = req.body

        const user = await User.findOne({ where: { email: email } })
        
        if(!user) {
            req.flash('message', 'Usuário não encontrado.')
            res.render('auth/login')
            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash('message', 'Senha inválida.')
            res.render('auth/login')

            return
        }

        req.session.userid = user.id
            
        //req.flash('message', 'Autenticação realizada com sucesso!')
    
        req.session.save(() => {
            res.redirect('/')
        })

    }

    static async loginGooglePost(req, res) {

            const {googleToken, googleEmail, googleName} = req.body

            const checkIfUserhasEmailRegistered = await User.findOne({where: {email: googleEmail}});
            const checkIfUserhasTokenRegistered = await User.findOne({where: {tokenGoogleUser: googleToken}});

            

            if(checkIfUserhasTokenRegistered) {
                req.session.userid = checkIfUserhasTokenRegistered.id

                req.flash('message', 'Usuário logado com o Google!')

                req.session.save(() => {
                    res.redirect('/')
                })

            }else if(!checkIfUserhasEmailRegistered){
                const user = {
                    name: googleName,
                    email: googleEmail,
                    tokenGoogleUser: googleToken
                }
    
                try {
                    const createdUser = await UserGoogle.create(user)
    
                    req.session.userid = createdUser.id
                
                    req.flash('message', 'Cadastro com Google realizado com sucesso!')
                
                    req.session.save(() => {
                        res.redirect('/')
                    })
                
                } catch(err) {
                    console.log(err)
                }            
            }else {
                const user = {
                    email: googleEmail,
                    tokenGoogleUser: googleToken
                }

                try {
                    const updatedUser = await UserGoogle.update({ tokenGoogleUser: user.tokenGoogleUser }, {
                        where: {
                            email: user.email
                        }
                      });
    
                    req.session.userid = updatedUser.id
                
                    req.flash('message', 'Email cadastrado sem o token do Google, agora possui o token!')
                
                    req.session.save(() => {
                        res.redirect('/')
                    })
                
                } catch(err) {
                    console.log(err)
                }
            }
    }

}