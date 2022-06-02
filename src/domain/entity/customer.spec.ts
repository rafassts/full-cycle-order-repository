import Address from "./address";
import Customer from "./customer";


describe("customer unit tests",() => {
    
    it("should throw error when id is empty",() =>{
        
        expect(() => {
            let customer = new Customer("","John");
        }).toThrowError("Id is required");
    });

    it("should throw error when name is empty",() =>{
        
        expect(() => {
            let customer = new Customer("1234","");
        }).toThrowError("Name is required");
    });

    it("should change name",() =>{
        //arrange
        const customer = new Customer("123","João");
        //act
        customer.changeName("Jane");
        //assert
        expect(customer.Name).toBe("Jane");
    });

    it("should activate customer",() =>{
       const customer = new Customer("1","Rafa");
       const address = new Address("Avenida Paulo Marcondes",600,"19025-000","Prudente");
       customer.setAddress(address);
       customer.activate();

       expect(customer.isActive()).toBe(true);
    });

    it("should not activate customer if address is not correct",() =>{
        const customer = new Customer("1","Rafa");

        expect(() => {
            customer.activate();
        }).toThrowError("Address is mandatory to activate a customer");
     });

    it("should deactivate customer",() =>{
        const customer = new Customer("1","Rafa");
        customer.deactivate();
 
        expect(customer.isActive()).toBe(false);
     });

     it("should add reward points",() => {
        const customer = new Customer("1","Customer 1");
        expect(customer.rewardPoints).toBe(0);
        customer.addRewardPoints(10);
        expect(customer.rewardPoints)
        customer.removeRewardPoints(5);
        expect(customer.rewardPoints).toBe(5);
     });

     it("should not remove more than all reward points",() => {
        const customer = new Customer("1","Customer 1");
        customer.addRewardPoints(10);
        expect(customer.rewardPoints)
        
        expect(() => {
            customer.removeRewardPoints(15);
        }).toThrowError("Cannot remove more than all reward points");
        
        
     });


});