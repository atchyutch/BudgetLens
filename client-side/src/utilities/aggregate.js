function Aggregate(data_recieved){
    // aggregate transactions by category.
    let category_dict = {};
    data_recieved.transactions.forEach(element => {
        let pfc = element.personal_finance_category?.primary || "OTHER" ;
        category_dict[pfc] = (category_dict[pfc] || 0)+element.amount;
    });

    return category_dict;
}

export default Aggregate;