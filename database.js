const csvData = `Procedure,Surgeon,Duration,Turnover
Thyroidectomy,Dr. Santos,100,33
Total Knee Arthroplasty,Dr. Reyes,118,23
Colectomy,Dr. Cruz,158,49
Laparoscopic Cholecystectomy,Dr. Reyes,71,15
Cataract Surgery,Dr. Garcia,24,32
Lumbar Spinal Fusion,Dr. Tan,215,31
Laparoscopic Cholecystectomy,Dr. Ramos,58,25
Lumbar Spinal Fusion,Dr. Santos,174,15
Cataract Surgery,Dr. Santos,18,15
Thyroidectomy,Dr. Reyes,88,25
Hernia Repair,Dr. Santos,54,22
Septoplasty,Dr. Garcia,56,43
Septoplasty,Dr. Mendoza,55,38
Laparoscopic Cholecystectomy,Dr. Mendoza,50,17
Hernia Repair,Dr. Tan,68,15
Carpal Tunnel Release,Dr. Santos,31,29
Coronary Artery Bypass Graft,Dr. Mendoza,257,15
Laparoscopic Cholecystectomy,Dr. Tan,69,46
Coronary Artery Bypass Graft,Dr. Mendoza,195,39
Coronary Artery Bypass Graft,Dr. Ramos,219,18
Laparoscopic Cholecystectomy,Dr. Ocampo,65,39
Thyroidectomy,Dr. Ocampo,67,17
Carpal Tunnel Release,Dr. Tan,22,25
Laparoscopic Cholecystectomy,Dr. Cruz,44,30
Cataract Surgery,Dr. Santos,15,15
Lumbar Spinal Fusion,Dr. Ramos,204,90
Laparoscopic Cholecystectomy,Dr. Ramos,50,25
Septoplasty,Dr. Dizon,55,31
Laparoscopic Cholecystectomy,Dr. Reyes,57,31
Coronary Artery Bypass Graft,Dr. Dizon,210,41
Colectomy,Dr. Dizon,160,29
"Total Knee Arthroplasty, Left",Dr. Reyes,99,15
Lumbar Spinal Fusion,Dr. Dizon,161,79
Cataract Surgery,Dr. Ramos,21,30
Colectomy,Dr. Tan,94,25
Hernia Repair,Dr. Ramos,42,32
Tonsillectomy,Dr. Ocampo,36,32
Lumbar Spinal Fusion,Dr. Cruz,196,28
Hysterectomy,Dr. Cruz,105,35
Septoplasty,Dr. Ocampo,50,40
Coronary Artery Bypass Graft,Dr. Santos,309,15
Laparoscopic Cholecystectomy,Dr. Ramos,81,15
Tonsillectomy,Dr. Santos,30,20
Carpal Tunnel Release,Dr. Ocampo,39,58
Carpal Tunnel Release,Dr. Santos,22,20
"Hernia Repair, Inguinal",Dr. Mendoza,67,15
Hysterectomy,Dr. Dizon,87,15
Coronary Artery Bypass Graft,Dr. Tan,261,59
Laparoscopic Cholecystectomy,Dr. Lopez,75,28
Cataract Surgery,Dr. Ramos,24,52
"Total Hip Arthroplasty, Right",Dr. Cruz,138,15
Total Hip Arthroplasty,Dr. Ocampo,103,56
Hernia Repair,Dr. Cruz,61,28
Hernia Repair,Dr. Mendoza,79,15
Appendectomy,Dr. Mendoza,64,24
Cataract Surgery,Dr. Ramos,24,28
Cataract Surgery,Dr. Santos,21,22
Mastectomy,Dr. Ocampo,84,76
Lumbar Spinal Fusion,Dr. Ramos,156,15
Colectomy,Dr. Garcia,136,28
Hysterectomy,Dr. Dizon,90,33
Carpal Tunnel Release,Dr. Dizon,23,47
Coronary Artery Bypass Graft,Dr. Santos,218,15
Total Hip Arthroplasty,Dr. Lopez,97,33
Thyroidectomy,Dr. Ramos,78,26
Hysterectomy,Dr. Lopez,93,18
Thyroidectomy,Dr. Cruz,72,48
Cataract Surgery,Dr. Reyes,21,22
Mastectomy,Dr. Dizon,94,15
Hysterectomy,Dr. Ocampo,100,27
Lumbar Spinal Fusion,Dr. Tan,151,52
Tonsillectomy,Dr. Mendoza,26,15
Thyroidectomy,Dr. Mendoza,95,21
Tonsillectomy,Dr. Reyes,35,37
Hernia Repair,Dr. Santos,41,51
Laparoscopic Cholecystectomy,Dr. Garcia,49,41
Appendectomy,Dr. Ocampo,49,15
Colectomy,Dr. Lopez,123,26
Lumbar Spinal Fusion,Dr. Mendoza,194,19
Tonsillectomy,Dr. Cruz,25,35
Lumbar Spinal Fusion,Dr. Reyes,215,15
Septoplasty,Dr. Ocampo,49,16
Cataract Surgery,Dr. Tan,19,15
Cataract Surgery,Dr. Lopez,21,36
Tonsillectomy,Dr. Garcia,27,39
Carpal Tunnel Release,Dr. Garcia,27,33
Hysterectomy,Dr. Santos,82,16
Lumbar Spinal Fusion,Dr. Ramos,147,15
Appendectomy,Dr. Lopez,38,15
Hysterectomy,Dr. Mendoza,67,40
Thyroidectomy,Dr. Cruz,81,15
Coronary Artery Bypass Graft,Dr. Ocampo,209,19
"Total Knee Arthroplasty, Left",Dr. Reyes,119,55
Tonsillectomy,Dr. Cruz,26,23
Coronary Artery Bypass Graft,Dr. Tan,228,55
Hysterectomy,Dr. Santos,81,24
Tonsillectomy,Dr. Reyes,24,16
Total Knee Arthroplasty,Dr. Dizon,127,27
Coronary Artery Bypass Graft,Dr. Ramos,245,15
Mastectomy,Dr. Tan,85,15
Cataract Surgery,Dr. Santos,17,25
Hernia Repair,Dr. Reyes,50,15
Total Knee Arthroplasty,Dr. Santos,98,53
Hernia Repair,Dr. Reyes,38,15
Total Knee Arthroplasty,Dr. Garcia,125,29
Appendectomy,Dr. Lopez,70,15
Coronary Artery Bypass Graft,Dr. Reyes,272,15
Total Knee Arthroplasty,Dr. Ramos,120,15
Appendectomy,Dr. Tan,47,31
Total Hip Arthroplasty,Dr. Ocampo,130,15
Hysterectomy,Dr. Cruz,97,15
Hernia Repair,Dr. Ocampo,49,15
Hernia Repair,Dr. Mendoza,64,30
Colectomy,Dr. Tan,140,21
Hysterectomy,Dr. Garcia,94,19
Appendectomy,Dr. Ramos,34,19
Colectomy,Dr. Tan,129,15
Appendectomy,Dr. Reyes,30,15
Laparoscopic Cholecystectomy,Dr. Lopez,60,31
Total Knee Arthroplasty,Dr. Mendoza,111,15
Colectomy,Dr. Ocampo,123,48
Tonsillectomy,Dr. Cruz,23,20
Total Knee Arthroplasty,Dr. Garcia,99,15
Coronary Artery Bypass Graft,Dr. Dizon,305,26
Laparoscopic Cholecystectomy,Dr. Santos,106,15
Mastectomy,Dr. Garcia,109,55
Mastectomy,Dr. Dizon,121,15
Mastectomy,Dr. Garcia,75,27
Total Hip Arthroplasty,Dr. Ocampo,144,21
Coronary Artery Bypass Graft,Dr. Ramos,245,15
Laparoscopic Cholecystectomy,Dr. Mendoza,68,21
Cataract Surgery,Dr. Garcia,23,15
Total Hip Arthroplasty,Dr. Lopez,110,46
Coronary Artery Bypass Graft,Dr. Ramos,253,62
Appendectomy,Dr. Reyes,51,17
Carpal Tunnel Release,Dr. Ocampo,16,35
Hysterectomy,Dr. Garcia,92,15
Tonsillectomy,Dr. Ramos,29,18
Total Knee Arthroplasty,Dr. Ocampo,128,15
Septoplasty,Dr. Dizon,60,15
Carpal Tunnel Release,Dr. Dizon,42,19
Cataract Surgery,Dr. Garcia,29,53
Hysterectomy,Dr. Ocampo,105,32
Tonsillectomy,Dr. Cruz,31,61
Laparoscopic Cholecystectomy,Dr. Tan,46,15
Tonsillectomy,Dr. Ramos,29,39
Carpal Tunnel Release,Dr. Tan,29,39
Laparoscopic Cholecystectomy,Dr. Reyes,41,15
Septoplasty,Dr. Tan,67,20
Total Knee Arthroplasty,Dr. Cruz,135,20
Appendectomy,Dr. Ramos,46,28
Colectomy,Dr. Tan,121,51
Septoplasty,Dr. Garcia,57,68
Tonsillectomy,Dr. Lopez,33,15
Colectomy,Dr. Lopez,134,18
Laparoscopic Cholecystectomy,Dr. Dizon,61,24
Thyroidectomy,Dr. Cruz,81,18
Total Hip Arthroplasty,Dr. Santos,90,15
Cataract Surgery,Dr. Lopez,15,15
Total Knee Arthroplasty,Dr. Reyes,125,25
Tonsillectomy,Dr. Cruz,33,29
Septoplasty,Dr. Ocampo,67,43
Hernia Repair,Dr. Mendoza,45,15
Carpal Tunnel Release,Dr. Tan,28,18
Appendectomy,Dr. Ocampo,44,53
Hernia Repair,Dr. Cruz,59,15
Total Knee Arthroplasty,Dr. Dizon,117,15
Septoplasty,Dr. Cruz,68,15
Cataract Surgery,Dr. Cruz,21,41
Total Knee Arthroplasty,Dr. Tan,108,53
Septoplasty,Dr. Tan,55,22
Hysterectomy,Dr. Tan,90,15
Total Knee Arthroplasty,Dr. Mendoza,122,54
Appendectomy,Dr. Ramos,41,18
Mastectomy,Dr. Lopez,92,45
Cataract Surgery,Dr. Reyes,25,16
Laparoscopic Cholecystectomy,Dr. Garcia,63,22
Lumbar Spinal Fusion,Dr. Dizon,185,42
Carpal Tunnel Release,Dr. Santos,35,15
Septoplasty,Dr. Mendoza,52,28
Thyroidectomy,Dr. Ocampo,75,30
Total Knee Arthroplasty,Dr. Tan,115,20
Colectomy,Dr. Cruz,145,35
Hernia Repair,Dr. Lopez,58,25
Tonsillectomy,Dr. Garcia,28,19
Coronary Artery Bypass Graft,Dr. Reyes,240,50
Hysterectomy,Dr. Dizon,88,29
Carpal Tunnel Release,Dr. Cruz,21,15
Total Hip Arthroplasty,Dr. Ramos,125,40
Mastectomy,Dr. Santos,95,33
Appendectomy,Dr. Tan,49,20
Laparoscopic Cholecystectomy,Dr. Ocampo,55,18
Thyroidectomy,Dr. Garcia,82,31
Lumbar Spinal Fusion,Dr. Mendoza,205,60
Cataract Surgery,Dr. Dizon,20,15
Hernia Repair,Dr. Reyes,47,15
Septoplasty,Dr. Lopez,60,35
Colectomy,Dr. Ramos,132,41
Total Knee Arthroplasty,Dr. Cruz,119,30
Tonsillectomy,Dr. Ocampo,34,25
Coronary Artery Bypass Graft,Dr. Garcia,230,48
Hysterectomy,Dr. Reyes,95,22
Carpal Tunnel Release,Dr. Mendoza,25,17
Appendectomy,Dr. Santos,37,15
Mastectomy,Dr. Tan,100,50
Laparoscopic Cholecystectomy,Dr. Dizon,59,27
Thyroidectomy,Dr. Lopez,88,23
Lumbar Spinal Fusion,Dr. Cruz,190,55
Cataract Surgery,Dr. Ocampo,22,15
Hernia Repair,Dr. Garcia,53,26
Septoplasty,Dr. Reyes,58,32
Colectomy,Dr. Mendoza,138,37
Total Knee Arthroplasty,Dr. Santos,105,25
Tonsillectomy,Dr. Tan,30,21
Coronary Artery Bypass Graft,Dr. Cruz,255,52
Hysterectomy,Dr. Lopez,91,28
Carpal Tunnel Release,Dr. Ramos,26,20
Appendectomy,Dr. Garcia,43,15
Mastectomy,Dr. Dizon,110,40
Laparoscopic Cholecystectomy,Dr. Reyes,62,19
Thyroidectomy,Dr. Tan,79,25
Lumbar Spinal Fusion,Dr. Santos,198,45
Cataract Surgery,Dr. Mendoza,18,15
Hernia Repair,Dr. Ocampo,50,23
Septoplasty,Dr. Cruz,54,30
Colectomy,Dr. Dizon,152,44
Total Knee Arthroplasty,Dr. Lopez,121,32
Tonsillectomy,Dr. Reyes,32,17
Coronary Artery Bypass Graft,Dr. Ramos,225,45
Hysterectomy,Dr. Tan,93,24
Carpal Tunnel Release,Dr. Ocampo,24,18
Appendectomy,Dr. Cruz,39,15
Mastectomy,Dr. Garcia,98,38
Laparoscopic Cholecystectomy,Dr. Santos,56,16
Thyroidectomy,Dr. Reyes,85,28
Lumbar Spinal Fusion,Dr. Garcia,188,50
Cataract Surgery,Dr. Tan,23,15
Hernia Repair,Dr. Dizon,55,24
Septoplasty,Dr. Ramos,61,33
Colectomy,Dr. Ocampo,129,39
Total Knee Arthroplasty,Dr. Mendoza,112,27
Tonsillectomy,Dr. Santos,31,22
Coronary Artery Bypass Graft,Dr. Lopez,235,49
Hysterectomy,Dr. Cruz,89,26
Carpal Tunnel Release,Dr. Garcia,22,16
Appendectomy,Dr. Dizon,45,19
Mastectomy,Dr. Reyes,105,42
Laparoscopic Cholecystectomy,Dr. Tan,65,23
Thyroidectomy,Dr. Mendoza,92,34
Lumbar Spinal Fusion,Dr. Ocampo,200,58
Cataract Surgery,Dr. Cruz,19,15
Hernia Repair,Dr. Ramos,48,21
Septoplasty,Dr. Santos,59,31
Colectomy,Dr. Garcia,142,46
Total Knee Arthroplasty,Dr. Dizon,116,28
Tonsillectomy,Dr. Lopez,27,18
Coronary Artery Bypass Graft,Dr. Tan,248,55
Hysterectomy,Dr. Ramos,96,30
Carpal Tunnel Release,Dr. Reyes,28,19
Appendectomy,Dr. Mendoza,40,16
Mastectomy,Dr. Cruz,102,36
Laparoscopic Cholecystectomy,Dr. Lopez,64,20
Thyroidectomy,Dr. Dizon,76,26
Lumbar Spinal Fusion,Dr. Reyes,195,48
Cataract Surgery,Dr. Ramos,21,15
Hernia Repair,Dr. Tan,52,29
Septoplasty,Dr. Garcia,56,34
Colectomy,Dr. Santos,135,40
Total Knee Arthroplasty,Dr. Ocampo,110,24
Tonsillectomy,Dr. Cruz,33,23
Coronary Artery Bypass Graft,Dr. Mendoza,260,58
Hysterectomy,Dr. Garcia,90,25
Carpal Tunnel Release,Dr. Lopez,23,15
Appendectomy,Dr. Reyes,42,17
Mastectomy,Dr. Ramos,96,35
Laparoscopic Cholecystectomy,Dr. Cruz,58,17
Thyroidectomy,Dr. Santos,89,29
Lumbar Spinal Fusion,Dr. Tan,202,53
Cataract Surgery,Dr. Garcia,25,16
Hernia Repair,Dr. Cruz,56,27
Septoplasty,Dr. Ocampo,62,36
Colectomy,Dr. Reyes,148,47
Total Knee Arthroplasty,Dr. Garcia,123,31
Tonsillectomy,Dr. Mendoza,29,20
Coronary Artery Bypass Graft,Dr. Santos,242,53
Hysterectomy,Dr. Dizon,92,27
Carpal Tunnel Release,Dr. Tan,27,16
Appendectomy,Dr. Lopez,36,15
Mastectomy,Dr. Ocampo,108,44
Laparoscopic Cholecystectomy,Dr. Ramos,60,21
Thyroidectomy,Dr. Garcia,80,27
Lumbar Spinal Fusion,Dr. Lopez,192,52
Cataract Surgery,Dr. Santos,16,15
Hernia Repair,Dr. Mendoza,49,22
Septoplasty,Dr. Tan,57,30
Colectomy,Dr. Cruz,139,42
Total Knee Arthroplasty,Dr. Reyes,114,26
Tonsillectomy,Dr. Dizon,30,19
Coronary Artery Bypass Graft,Dr. Ocampo,238,51
Hysterectomy,Dr. Santos,94,29
Carpal Tunnel Release,Dr. Garcia,20,15
Appendectomy,Dr. Ramos,44,18
Mastectomy,Dr. Lopez,99,39
Laparoscopic Cholecystectomy,Dr. Reyes,66,24
Thyroidectomy,Dr. Tan,84,32
Lumbar Spinal Fusion,Dr. Cruz,199,56
Cataract Surgery,Dr. Reyes,24,15
Hernia Repair,Dr. Dizon,51,25
Septoplasty,Dr. Mendoza,53,29
Colectomy,Dr. Tan,141,45
Total Knee Arthroplasty,Dr. Ramos,118,29
Tonsillectomy,Dr. Garcia,26,16
Coronary Artery Bypass Graft,Dr. Dizon,250,56
Hysterectomy,Dr. Ocampo,98,31
Carpal Tunnel Release,Dr. Cruz,25,19
Appendectomy,Dr. Santos,40,15
Mastectomy,Dr. Mendoza,104,41
Laparoscopic Cholecystectomy,Dr. Garcia,61,20
Thyroidectomy,Dr. Lopez,77,24
Lumbar Spinal Fusion,Dr. Ramos,193,49
Cataract Surgery,Dr. Tan,20,15
Hernia Repair,Dr. Santos,46,20
Septoplasty,Dr. Reyes,60,32
Colectomy,Dr. Lopez,133,38
Total Knee Arthroplasty,Dr. Cruz,120,33
Tonsillectomy,Dr. Ocampo,32,24
Coronary Artery Bypass Graft,Dr. Garcia,228,47`;