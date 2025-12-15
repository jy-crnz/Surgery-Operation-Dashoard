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
Total Knee Arthroplasty,Dr. Mendoza,122,54`;