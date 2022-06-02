import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
    
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.Id,
            name: entity.Name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
            
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.Name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
            
        },
        {
             where: 
             {
                id: entity.Id
             }
        });
    }
    async find(id: string): Promise<Customer> {
        try {
            let customer = await CustomerModel.findOne({where: {id}, rejectOnEmpty: true});
            const address = new Address(customer.street,customer.number,customer.zipcode,customer.city);
            const result = new Customer(customer.id,customer.name);
            result.setAddress(address);
            result.addRewardPoints(customer.rewardPoints);
            if(customer.active)
               result.activate();
            return result;
        }catch(error){
            throw new Error("Customer not found");
        }
    }
    
    async findAll(): Promise<Customer[]> {
        const customers = await CustomerModel.findAll();
        return customers.map((c) => {
           const address = new Address(c.street,c.number,c.zipcode,c.city);
           const customer = new Customer(c.id,c.name);
           customer.setAddress(address);
           customer.addRewardPoints(c.rewardPoints);
           if(c.active)
               customer.activate();
           
           return customer;
        });
    }

}