/*
Students
`Admin Number` char(7) NOT NULL PRIMARY KEY,
`Student Name` varchar(64) NOT NULL,
`Citizenship Status` enum('Singapore citizen' 'Permanent resident' 'International student') NOT NULL,
`Study Stage` tinyint NOT NULL,
`Course Code` char(6) NOT NULL,
`PEM Group` char(6) NOT NULL
*/
INSERT INTO Students (`Admin Number`, `Student Name`, `Citizenship Status`, `Study Stage`, `Course Code`, `PEM Group`)
VALUES
('A123456', 'John Doe', 'Singapore citizen', 1, 'CSC101', 'PEM101'),
('A234567', 'Jane Smith', 'Permanent resident', 2, 'CSC102', 'PEM102'),
('A345678', 'Bob Johnson', 'International student', 3, 'CSC103', 'PEM103'),
('A456789', 'Alice Lee', 'Singapore citizen', 4, 'CSC104', 'PEM104'),
('A567890', 'David Tan', 'Permanent resident', 1, 'CSC105', 'PEM105'),
('A678901', 'Sarah Lim', 'International student', 2, 'CSC106', 'PEM106'),
('A789012', 'Tom Wong', 'Singapore citizen', 3, 'CSC107', 'PEM107'),
('A890123', 'Emily Ng', 'Permanent resident', 4, 'CSC108', 'PEM108'),
('A901234', 'Michael Chen', 'International student', 1, 'CSC109', 'PEM109'),
('A012345', 'Karen Tan', 'Singapore citizen', 2, 'CSC110', 'PEM110'),
('A123457', 'Peter Lim', 'Permanent resident', 3, 'CSC111', 'PEM111'),
('A234568', 'Lisa Tan', 'International student', 4, 'CSC112', 'PEM112'),
('A345679', 'Steven Lee', 'Singapore citizen', 1, 'CSC113', 'PEM113'),
('A456790', 'Grace Ng', 'Permanent resident', 2, 'CSC114', 'PEM114'),
('A567901', 'Kevin Tan', 'International student', 3, 'CSC115', 'PEM115'),
('A678912', 'Michelle Lim', 'Singapore citizen', 4, 'CSC116', 'PEM116'),
('A789023', 'Daniel Wong', 'Permanent resident', 1, 'CSC117', 'PEM117'),
('A890134', 'Sophia Chen', 'International student', 2, 'CSC118', 'PEM118'),
('A901245', 'Alex Tan', 'Singapore citizen', 3, 'CSC119', 'PEM119'),
('A012356', 'Ella Lim', 'Permanent resident', 4, 'CSC120', 'PEM120'),
('A123467', 'Ryan Lee', 'International student', 1, 'CSC121', 'PEM121'),
('A234578', 'Olivia Tan', 'Singapore citizen', 2, 'CSC122', 'PEM122'),
('A345689', 'Matthew Lim', 'Permanent resident', 3, 'CSC123', 'PEM123'),
('A678012', 'Ava Lim', 'International student', 4, 'CSC136', 'PEM136'),
('A789123', 'Brandon Lee', 'Singapore citizen', 1, 'CSC137', 'PEM137'),
('A890234', 'Emma Tan', 'Permanent resident', 2, 'CSC138', 'PEM138'),
('A901345', 'Nichole Lim', 'International student', 3, 'CSC139', 'PEM139'),
('A012456', 'Jacob Lee', 'Singapore citizen', 4, 'CSC140', 'PEM140'),
('A123567', 'Sophie Tan', 'Permanent resident', 1, 'CSC141', 'PEM141'),
('A234678', 'Tyler Lim', 'International student', 2, 'CSC142', 'PEM142'),
('A345789', 'Avery Ng', 'Singapore citizen', 3, 'CSC143', 'PEM143'),
('A456901', 'Ethan Tan', 'Permanent resident', 4, 'CSC144', 'PEM144'),
('A567012', 'Madison Lim', 'International student', 1, 'CSC145', 'PEM145'),
('A678123', 'Noah Lee', 'Singapore citizen', 2, 'CSC146', 'PEM146'),
('A789234', 'Aria Tan', 'Permanent resident', 3, 'CSC147', 'PEM147'),
('A890345', 'Logan Lim', 'International student', 4, 'CSC148', 'PEM148'),
('A901456', 'Aaliyah Lee', 'Singapore citizen', 1, 'CSC149', 'PEM149'),
('A012567', 'Caleb Tan', 'Permanent resident', 2, 'CSC150', 'PEM150');