class Profile {

    constructor({ username, name: { firstName, lastName }, password}) {
        this.username = username;
        this.name = {
            firstName,
            lastName
          };
        this.password = password;
    }

    createUser(callback) {
        return ApiConnector.createUser(
            {
              username: this.username,
              name: this.name,
              password: this.password
            },
            (err, data) => {
            console.log(`Creating user ${this.username}`);
            callback(err, data);
        });
    }

    performLogin(callback) {
        return ApiConnector.performLogin(
            {
                username: this.username,
                password: this.password
            },
            (err, data) => {
            console.log(`Logging in user ${this.username}`);
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
        return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            console.log(`Successfully converting ${targetAmount} from ${fromCurrency} to ${targetCurrency}`);
            callback(err, data);
        });        
    }

}

function getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
        console.log(`Getting stocks info`);
        callback(err, data);
    });
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
                
    const startCapital = { currency: 'EUR', amount: 500000 };

    getStocks((err, data) => {
        if (err) {
            console.error('Error during getting stocks');
        }
        // записываем текущее значение курсов валют
        const stocksInfo = data[0];        
        
        // сначала создаем и авторизуем пользователя
        Ivan.createUser( (err, data) => {
            if (err) {
                console.error(`Error during creating ${Ivan.username}`);
            }
            else {
                console.log(`User ${Ivan.username} successfully created`);
                Ivan.performLogin( (err, data) => {
                    if (err) {
                        console.error(`Error during logging in ${Ivan.username}`);
                    }
                    else {
                        console.log(`User ${Ivan.username} successfully logging in`);
    
                        // после того, как мы авторизовали пользователя, добавляем ему денег в кошелек
                        Ivan.addMoney(startCapital, (err, data) => {
                            if (err) {
                                console.error(`Error during adding money to ${Ivan.username}`);
                            }
                            else {
                                console.log(`Added ${startCapital.amount} ${startCapital.currency} to ${Ivan.username}`);

                                // переведем Евро в Неткоины  
                                const targetAmount = stocksInfo['EUR_NETCOIN'] * startCapital.amount;                                                        
                                Ivan.convertMoney({ fromCurrency: startCapital.currency, targetCurrency: 'NETCOIN', targetAmount: targetAmount }, (err, data) => {
                                    if (err) {
                                        console.error(`Error converting money from  ${startCapital.currency} to NETCOIN`);
                                    }
                                    else {
                                        console.log(`Successfully converted ${startCapital.amount} ${startCapital.currency} to ${targetAmount} NETCOIN`);
                                        // создаем второго пользователя
                                        Petya.createUser( (err, data) => {
                                            if (err) {
                                                console.error(`Error during creating ${Petya.username}`);
                                            }
                                            else {
                                                console.log(`User ${Petya.username} successfully created`);
                                                // переведеи Неткоины Пете
                                                Ivan.transferMoney({ to: Petya.username, amount: targetAmount }, (err, data) => {
                                                    if (err) {
                                                        console.error(`Error during transfer money to ${Petya.username}`);
                                                    }
                                                    else {
                                                        console.log(`Successfully transfered ${targetAmount} netcoins to ${Petya.username}`);
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
    });
}

main();