import random
from datetime import datetime, timedelta

# names to choose from
first_names = ['John', 'Mary', 'James', 'Linda', 'Robert', 'Patricia', 
               'Michael', 'Jennifer', 'William', 'Elizabeth', 'David', 'Susan',
               'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen',
               'Christopher', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty',
               'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
               'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna',
               'Joshua', 'Michelle', 'Kenneth', 'Carol', 'Kevin', 'Amanda',
               'Brian', 'Melissa', 'George', 'Deborah', 'Timothy', 'Stephanie',
               'Ronald', 'Dorothy', 'Edward', 'Rebecca', 'Jason', 'Sharon',
               'Jeffrey', 'Laura', 'Ryan', 'Cynthia', 'Jacob', 'Kathleen']

last_names = ['Smith', 'Singh', 'Williams', 'Persaud', 'Jones', 'Thomas',
              'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
              'Anderson', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
              'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis',
              'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'Hernandez',
              'King', 'Wright', 'Lopez', 'Hill', 'Scott', 'Green',
              'Adams', 'Baker', 'Gonzalez', 'Nelson', 'Carter', 'Mitchell',
              'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker',
              'Evans', 'Edwards', 'Collins', 'Stewart', 'Sanchez', 'Morris',
              'Rogers', 'Reed', 'Cook', 'Morgan', 'Bell', 'Murphy']

passenger_types = ['adult', 'child', 'senior']
fare_amounts = {'adult': 380.00, 'child': 200.00, 'senior': 0.00}

def get_random_dob():
    year = random.randint(1950, 2015)
    return f"{year}-01-01"

def get_random_phone():
    return f"592-{random.randint(600, 799)}{random.randint(1000, 9999)}"

def get_booking_date():
    base_date = datetime(2025, 12, 20)
    new_date = base_date + timedelta(days=random.randint(0, 10))
    return new_date.strftime('%Y-%m-%d %H:%M:%S')

with open('full_dump.sql', 'w') as file:

    file.write("-- ECRMS Ferry System\n\n")

    file.write(

        "INSERT INTO schedule (schedule_id, route_id, vessel_id, departure_datetime, arrival_datetime, status) VALUES "
        "(5, 1, 4, '2025-12-25 08:00:00', '2025-12-25 09:30:00', 'completed'), "
        "(6, 1, 2, '2025-12-25 12:00:00', '2025-12-25 13:30:00', 'completed'), "
        "(7, 1, 4, '2025-12-26 16:00:00', '2025-12-26 17:30:00', 'scheduled'), "
        "(8, 2, 3, '2025-12-24 10:00:00', '2025-12-24 11:30:00', 'completed');\n\n"
    )

    person_id = 1000
    booking_id = 1000
    ticket_id = 1000

    TOTAL_PEOPLE = 1000

    
    while person_id < 1000 + TOTAL_PEOPLE:

        fname = random.choice(first_names)
        lname = random.choice(last_names)
        phone = get_random_phone()
        email = f"{fname.lower()}.{lname.lower()}{person_id}@email.com"
        dob = get_random_dob()

        file.write(
            f"INSERT INTO person (person_id, first_name, last_name, phone, email, date_of_birth) "
            f"VALUES ({person_id}, '{fname}', '{lname}', '{phone}', '{email}', '{dob}');\n"
        )

        file.write(
            f"INSERT INTO passenger (person_id, id_number) "
            f"VALUES ({person_id}, 'GY-PASS-{person_id}');\n"
        )

        person_id += 1

    # reset person counter for bookings
    person_id = 1000 

   
    while person_id < 1000 + TOTAL_PEOPLE:

        group_size = random.randint(1, 5)
        schedule_id = random.randint(1, 8) 
        file.write(
            f"INSERT INTO booking (booking_id, person_id, schedule_id, booking_datetime, trip_type, status) "
            f"VALUES ({booking_id}, {person_id}, {schedule_id}, '{get_booking_date()}', 'one_way', 'confirmed');\n"
        )
        
        for _ in range(group_size):

            if person_id >= 1000 + TOTAL_PEOPLE:
                break

            passenger_type = random.choice(passenger_types)
            fare = fare_amounts[passenger_type]

            file.write(
                f"INSERT INTO ticket (ticket_id, booking_id, passenger_category, "
                f"passenger_fare_amount, status) "
                f"VALUES ({ticket_id}, {booking_id}, "
                f"'{passenger_type}', {fare}, 'active');\n"
            )

            person_id += 1
            ticket_id += 1

        booking_id += 1

    file.write("\n-- Script finished successfully\n")

print("Script completed successfully!")