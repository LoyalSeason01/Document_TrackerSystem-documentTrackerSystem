const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()

async function createStaffUser(name, email, password, divisionName, deptName, staffNumber){

    try {

        const foundEmail = await prisma.user.findMany({
            where : {email : email}
        });

        if(foundEmail.length === 0){

            const department = await prisma.department.create({
                data : { 
                    deptName
                }
            })
        
            const division = await prisma.division.create({
                data : {
                    divisionName,
                }
            })
        
            const newStaff = await prisma.staff.create({
                data: {
                  user: {
                    create: {
                      name,
                      email,
                      password,
                      division : {connect : {divisionId : division.divisionId}},
                      department : {connect : {deptId : department.deptId}},
                    }
                  },
                  staffNumber,
                  department : {connect : {deptId : department.deptId}},
                }
              });
        
              return newStaff;

        }else{
            return {error : 'Email Already Exist'}
        }
        
    } catch (error) {
        return error.meta;
    }

   
}

async function getAllStaffs(){
    try {
        const staff = await prisma.staff.findMany();
        return await prisma.user.findMany({
            where : {
                userId : staff.userId
            }
        });
    } catch (error) {
        return error;
    }
}

async function updateStaffData(staffNumber){
    try {
        return prisma.staff.findUnique({
            where : {staffNumber,},
            data  :{
                staffNumber
            }
        });
    } catch (error) {
        return error;
    }
}

async function deleteStaff(staffNumber){
  try {
    return prisma.staff.delete({
        where : {staffNumber},
    });
  } catch (error) {
    return error
  }
}

module.exports = {
    createStaffUser,
    getAllStaffs,
    updateStaffData,
    deleteStaff,
}