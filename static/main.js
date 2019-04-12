class Profile {

    constructor({ username: username, name: { firstName, lastName }, password: password}) {
        this.username = username;
        this.name = name;
        this.password = password;
    }

    createUser({ username, name, password}, callback) {
        return ApiConnector.createUser({ username, name, password }, (err, data) => {
            console.log(`Creating user ${username}`);
            callback(err, data);
        });
    }

    performLogin({ username, password }, callback) {
        return ApiConnector.performLogin({ username, password }, (err, data) => {
            console.log(`Logging in user ${username}`);
            callback(err, data);
        });        
    }    

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            console.log(`Adding ${amount} of ${currency} to ${this.username}`);
            callback(err, data);
        });
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            console.log(`Transfer ${amount} from ${this.username} to ${to}`);
            callback(err, data);
        });        
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.transferMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            console.log(`Successfully converting ${targetAmount} from ${fromCurrency} to ${targetCurrency}`);
            callback(err, data);
        });        
    }

}

function getStocks() {
    ApiConnector.getStocks((err, data) => {console.log(`Getting stocks info`)});
}

function main(){

    const Ivan = new Profile({
                    username: 'ivan',
                    name: { firstName: 'Ivan', lastName: 'Chernyshev' },
                    password: 'ivanspass',
                });

    const Petya = new Profile({
                   username: 'petya',
                   name: { firstName: 'Petr', lastName: 'Sergeev' },
                   password: 'petrspass',
                });                

    // сначала создаем и авторизуем пользователя
    Ivan.createUser( Ivan, (err, data) => {
        if (err) {
            console.error(`Error during creating ${Ivan.username}`);
        }
        else {
            console.log(`User ${Ivan.username} successfully created`);
            Ivan.performLogin({ username: Ivan.username, password: Ivan.password }, (err, data) => {
                if (err) {
                   console.error(`Error during logging in ${Ivan.username}`);
                    }
                else {
                    console.log(`User ${Ivan.username} successfully logging in`);

                    // после того, как мы авторизовали пользователя, добавляем ему денег в кошелек
                    Ivan.addMoney({ currency: 'EUR', amount: 500000 }, (err, data) => {
                        if (err) {
                            console.error(`Error during adding money to ${Ivan.username}`);
                        }
                        else {
                            console.log(`Added 500000 euros to ${Ivan.username}`);
                            // переведем Евро в Неткоины
                            getStocks();
                            
                            Ivan.convertMoney({ fromCurrency: 'EUR', targetCurrency: 'Неткоин', targetAmount: 500000 }, (err, data) => {
                                if (err) {
                                    console.error(`Error converting money from EUR to Неткоин`);
                                }
                                else {
                                    console.log(`Successfully converted 500000 EUR to Неткоин`);
                                    // создаем второго пользователя
                                    Petya.createUser( Petya, (err, data) => {
                                        if (err) {
                                            console.error(`Error during creating ${Petya.username}`);
                                        }
                                        else {
                                            console.log(`User ${Petya.username} successfully created`);
                                            // переведеи Неткоины Пете
                                            Ivan.transferMoney({ to: Petya.username, amount: 500000 }, (err, data) => {
                                                if (err) {
                                                    console.error(`Error during transfer money to ${Petya.username}`);
                                                }
                                                else {
                                                    console.log(`Successfully transfered 500000 euros to ${Petya.username}`);
                                                }
                                            });            
                                        }
                                    });    
                                }
                            });                
                        }
                    });                    
                }
            });        
        }
    });
}

main();