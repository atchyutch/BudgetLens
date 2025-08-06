import {plaid} from"../app.js"; 
import {createconn} from "../services/database_conn.js"; 
import {get_trans_function} from "../services/plaidServices.js";



export async function linktoken_func (req, res){
    try{const user_id = req.user.id;
    const {data} = await plaid.linkTokenCreate({ client_name: "BudgetLens",
        user: { client_user_id: String(user_id)|| 'demo-user' },
        products: ['transactions'],
        country_codes: ['US'],        
        language: 'en'
    })
    res.status(200).json({link_token: data.link_token});
}catch (err) {
    // PlaidError objects carry their JSON in err.response.data
    console.error('Plaid raw error object →', err);
    console.error(
      'Plaid HTTP status →', err.response?.status || 'no status'
    );
    console.error(
      'Plaid error body →', JSON.stringify(err.response?.data, null, 2)
    );
    return res.status(500).json({ error: 'Plaid create_link_token failed' });
  }
}


export async function exchange_token_func(req, res) {
        const {public_token} = req.body;
        if (!public_token) {
            return res.status(400).json({error: 'Public token not provided/found could be problem in frontend message from backend'});
        }
        const {data} = await plaid.itemPublicTokenExchange({public_token: public_token});
        if (!data) {
            return res.status(400).json({error: 'Failed to exchange public token'});
        }
        // we need to store this data in the database not in the access storage.
        //so first lets get the details we need
    
        const access_token = data.access_token
        const item_id = data.item_id;
        const user_id = req.user.id;
        let conn;
        try{
          conn = await createconn();
          await conn.query("INSERT INTO accounts VALUES (?,?,?,?)", [item_id, access_token, user_id, new Date()]);
        }
        finally {
          if (conn) { await conn.end();}
        }
        res.sendStatus(200);
}


export async function get_trans(req, res) {
    // what does this do?
    // it fetches the transactions for that account. what do we need to get the details for tha transactions?
    //item_id, user_is, access_token.
    const user_id = req.user.id;
    const {item_id, encrypted_access_token} = await get_trans_function(user_id);
    if (!item_id || !encrypted_access_token) {
        return res.status(404).json({error: 'No accounts found for this user'});
    }


     
    let endDateobj = new Date();//today
    let startDateobj = new Date(); // 30 days before today

    startDateobj.setDate(endDateobj.getDate() - 30); // 30 days before today

    const startDate = startDateobj.toISOString().split('T')[0]; // format YYYY-MM-DD
    const endDate = endDateobj.toISOString().split('T')[0]; // format YYYY-MM-DD



    const access_token = encrypted_access_token; // in this case we are using the encrypted access token directly, but we should decrypt it before using it.
    const { data } = await plaid.transactionsGet({
    access_token,
    start_date:   startDate,
    end_date:     endDate,
    options: {
        include_personal_finance_category: true, 
        count: 250,     // max per page
        offset: 0,
    },
    }); 
    console.log("Transactions fetched:", data.transactions[0].personal_finance_category);
    console.log("Transactions fetched:", data);
    return res.status(200).json({ transactions: data.transactions });

}

export async function get_accounts_plaid(req, res) {
    const user_id = req.user.id;
    let conn;
    try {
        conn = await createconn();
        const [rows] = await conn.query("SELECT item_id, encrypted_access_token FROM accounts WHERE user_id = ?", [user_id]);
        if (rows.length === 0) {
            return res.status(404).json({error: 'No accounts found for this user'});
        }
        const item_id = rows[0].item_id;
        const access_token = rows[0].encrypted_access_token;
        if (!access_token) {
            return res.status(404).json({error: 'No access token found for this user'});
        }
        const { data } = await plaid.accountsGet({ access_token });
        return res.status(200).json({ accounts: data.accounts });

    } finally {
        if (conn) { await conn.end(); }
    }
}