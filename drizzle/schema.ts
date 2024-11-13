import { subscriptionTiers, TierNames } from "@/data/subscriptionTire";
import { relations } from "drizzle-orm";
import { boolean, index, pgEnum, pgTable, primaryKey, real, text, timestamp, uuid } from "drizzle-orm/pg-core";

const createdAt = timestamp('created_at',{withTimezone:true}).notNull().defaultNow();
const updatedAt = timestamp('updated_at',{withTimezone:true}).notNull().defaultNow().$onUpdate(()=>new Date);

export const  ProductTable = pgTable("product",{
    id:uuid('id').primaryKey().defaultRandom(),
    clerkUserId:text('clerk_user_id').notNull(),
    name:text('name').notNull(),
    description:text('description'),
    url:text('url').notNull(),
    createdAt,
    updatedAt

},table =>({
    clerkUserIdIndex:index("products.clerk_user_id_index",).on(
        table.clerkUserId
    )
}))

export const productRelations =relations(ProductTable,(({one,many})=>({
    ProductCustomization:one(ProductCustomizationTable),
    ProductViews:many(productViewTable),
    CountryGroupDiscounts:many(CountryGroupDisountTable)
})));

export const ProductCustomizationTable = pgTable("product_customization",{
    id:uuid('id').primaryKey().defaultRandom(),
    classPrefix:text('class_prefix'),
    productId:uuid('product_id').notNull().references(()=>ProductTable.id,{onDelete:'cascade'}).unique(),
    locationMessage:text('location_message').notNull()
    .default(
        "Hey! It looks like you are from <b>{country}</b>. We support Parity Purchasing Power, so if you need it, use code <b>“{coupon}”</b> to get <b>{discount}%</b> off."),
    backgroundColor:text('background_color').notNull().default("hsl(193, 82%, 31%)"),
    textColor:text('text_color)').notNull().default("hsl(0, 0%, 100%)"),
    fontSize:text('font_size').notNull().default("1rem"),
    bannerContaier:text('banner_container').notNull().default("body"),
    isSticky:boolean('is_sticky').notNull().default(true),
    createdAt,
    updatedAt
},);

export const productCustomizationRelations =relations(ProductCustomizationTable,(({one,many})=>({
    product:one(ProductTable,{
        fields:[ProductCustomizationTable.productId],
        references:[ProductTable.id]
    })
})));

export const productViewTable = pgTable('product_views',{
    id:uuid('id').primaryKey().defaultRandom(),
    productId:uuid('product_id').notNull().references(()=>ProductTable.id,{onDelete:'cascade'}),
    countryId:uuid('country_id').notNull().references(()=>CountryTable.id,{onDelete:'cascade'}),
    visitedAt:timestamp('visited_at',{withTimezone:true}).notNull().defaultNow()
})

export const productViewRelations = relations(productViewTable,({one,many})=>({
    product:one(ProductTable,{
        fields:[productViewTable.productId],
        references:[ProductTable.id]
    }),
    country:one(CountryTable,{
        fields:[productViewTable.countryId],
        references:[CountryTable.id]
    })
}))

export const CountryTable = pgTable('country',{
    id:uuid('id').primaryKey().defaultRandom(),
    name:text('name').notNull().unique(),
    code:text('code').notNull().unique(),
    countryGroupId:uuid('country_group_id').notNull().references(()=>CountryGroupTable.id,{onDelete:'cascade'}),   
    createdAt,
    updatedAt
})

export const CountryGroupTable = pgTable('country_group',{
    id:uuid('id').primaryKey().defaultRandom(),
    name:text('name').notNull().unique(),
    recommendedDiscountPerecentage:real('recommended_discount_percentage'),
    createdAt,
    updatedAt
})

export const countryRelations = relations(CountryTable,({one,many})=>({
    countryGroup:one(CountryGroupTable,{
        fields:[CountryTable.countryGroupId],
        references:[CountryGroupTable.id]
    }),
    productViews:many(productViewTable)
}))

export const countryGroupRelations =  relations(CountryGroupTable,({one,many})=>({
    countries:many(CountryTable),
    countryGroupDisounts:many(CountryGroupDisountTable) 
}))

export const CountryGroupDisountTable = pgTable('country_group_discount',{
    countryGroupId:uuid('country_group_id').notNull().references(()=>CountryGroupTable.id,{onDelete:'cascade'}),
    productId:uuid('product_id').notNull().references(()=>ProductTable.id,{onDelete:'cascade'}),
    coupon:text('coupon').notNull(),
    discountPercentage:real('discount_percentage').notNull(),
    createdAt,
    updatedAt
},
    table => ({
        pk:primaryKey({columns:[table.countryGroupId,table.productId]}),
    })
)

export const countryGroupDiscountRelations = relations(CountryGroupDisountTable,({one,many})=>({
    product:one(ProductTable,{
        fields:[CountryGroupDisountTable.productId],
        references:[ProductTable.id]
    }),
    countryGroup:one(CountryGroupTable,{
        fields:[CountryGroupDisountTable.countryGroupId],
        references:[CountryGroupTable.id]
    })
}))

export const TierEnum = pgEnum('tier',Object.keys(subscriptionTiers) as [TierNames])

export const UserSubscriptionTable = pgTable('user_subscriptions',
    {
    id:uuid('id').primaryKey().defaultRandom(),
    clerkUserId:text('clerk_user_id').notNull().unique(),
    stripeSubscriptionItemId:text('stripe_subscription_item_id'),
    stripeSubscriptionId:text('stripe_subscription_id'),
    stripeCustomerId:text('stripe_customer_id'),
    tier: TierEnum('tier').notNull(),
    createdAt,
    updatedAt
    },
    table =>({
        clerkUserIdIndex:index('user_subscriptions.clerk_user_id_index').on(table.clerkUserId),
        stripeCustomerIdIndex:index('user_subscriptions.stripe_customer_id_index').on(table.stripeCustomerId)
    })
)