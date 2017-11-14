## Cokies

Formato dei cookies da usare. I cookie vengono salvati e ritornati come oggetti JSON

Cookie name: `porkett`

```
{
    logged: ['social1', 'social2', ...],        #lista dei social dove si è loggati attualmente
    twt:
    {
        token1: 'blabla',                       #i due token di accesso, se un social necessita
        token2: 'blabla'                        #di salvare altro lo aggiungiamo
    },
    tmb:
    {
        token1: 'blabla',
        token2: 'blabla',
    }
    
    ...  #e cosi via



}
```
