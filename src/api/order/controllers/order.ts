/**
 * order controller
 */
const stripe = require("stripe")("sk_test_51NrjLVGnmCOGWApAobpqJbts1PhoYgmwtGtfjbfWl1f81Y3XNS1ci16qG1bFP50YmUzdj4WagGyak6FYnyN9A1OC00OEdWfaaT");

import { factories } from '@strapi/strapi'

function calcDiscountPrice(price: number, discount: number){
    if(!discount) return price;

    const discountAmount  = (price* discount)/100;
    const result = price -discountAmount;

    return result.toFixed(2);


}

export default factories.createCoreController('api::order.order',({ strapi })=> ({
    async paymentOrder(ctx: { request: { body: { token: any; products: any; idUser: any; addressShipping: any; }; }; }){
        const { token, products, idUser, addressShipping } = ctx.request.body;

        let totalPayment = 0;

        products.forEach((product) => {
            const priceTemp = calcDiscountPrice(
                product.attributes.price,
                product.attributes.discount    
                );

                totalPayment += Number(priceTemp) * product.quantity;
        });

        const charge = await stripe.charges.create({
        amount: Math.round(totalPayment *100) ,
        currency: "usd",
        source: token.id,
        description: `User ID ${idUser}`,
        });

        const data = {
            products,
            user : idUser,
            totalPayment,
            idPayment:charge.id,
            addressShipping,
        };

        const model = strapi.contentType["api::order:order"];
        const validData = await strapi.entityValidator.validateEntityCreation(
            model,
            data
            );
            const entry = await strapi.db
            .query("api::order:order")
            .create({data: validData});

            return entry;

    },

}));
