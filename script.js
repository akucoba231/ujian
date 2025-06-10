$(document).ready(function() {
    let url = "";
    let myapi = "";
    const url1 = "https://nlpdata-5393.restdb.io/rest/";
    const url2 = "https://nlpdata2-9d3f.restdb.io/rest/";
    const myapi1 = "684301ad72702c6cc4b3d7d2";
    const myapi2 = "6843f2e8e22293a1177497af";

    url = url1;
    myapi = myapi1;
    
    // Sample data (tetap di sini agar DataTables bisa diinisialisasi dengan struktur data awal)
    let soalData = [];
    let jawabanData = [];
    let temaUjian = [];

    // Variabel untuk DataTables
    let soalTable, soalRealTable, jawabanTable;

    // Inisialisasi DataTables
    function initDataTables() {
        // Hancurkan DataTables jika sudah diinisialisasi sebelumnya untuk menghindari duplikasi
        if ($.fn.DataTable.isDataTable('#soal-table')) {
            $('#soal-table').DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable('#soal-real-table')) {
            $('#soal-real-table').DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable('#jawaban-table')) {
            $('#jawaban-table').DataTable().destroy();
        }

        // Inisialisasi baru
        soalTable = $('#soal-table').DataTable({
            responsive: true,
            scrollX: true,
            autoWidth: false,
            dom: '<"top"lf>rt<"bottom"ip>',
            data: temaUjian, // Menggunakan temaUjian sebagai data awal
            columns: [
                { data: 'id' },
                { data: 'tanggal' },
                { data: 'judul' },
                { data: 'deskripsi' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn-action btn-look" data-id="${row.id}" data-judul="${row.judul}"><i class="fas fa-eye"></i> Lihat</button>
                            <button class="btn-action btn-edit" data-id="${row.id}" data-judul="${row.judul}"><i class="fas fa-edit"></i> Ubah</button>
                            <button class="btn-action btn-delete" data-id="${row.id}" data-api="${row._id}"><i class="fas fa-trash"></i> Hapus</button>
                        `;
                    }
                }
            ],
            language: {
                search: "Cari:",
                lengthMenu: "Tampilkan _MENU_ data per halaman",
                info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                paginate: {
                    first: "Pertama",
                    last: "Terakhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya"
                }
            }
        });

        soalRealTable = $('#soal-real-table').DataTable({
            responsive: true,
            scrollX: true,
            autoWidth: false,
            dom: '<"top"lf>rt<"bottom"ip>',
            data: soalData, // Menggunakan soalData sebagai data awal
            columns: [
                { data: 'id' },
                { data: 'judul_soal' },
                { data: 'rincian' },
                { data: 'ideal' },
                { data: 'keyword' },
                { data: 'saran' },
                { data: 'nasihat' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn-action btn-edit" data-id="${row.id}"><i class="fas fa-edit"></i> Ubah</button>
                            <button class="btn-action btn-delete" data-id="${row.id_tema}" data-api="${row._id}"><i class="fas fa-trash"></i> Hapus</button>
                        `;
                    }
                }
            ],
            order: [[1, 'desc']],
            language: {
                search: "Cari:",
                lengthMenu: "Tampilkan _MENU_ data per halaman",
                info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                paginate: {
                    first: "Pertama",
                    last: "Terakhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya"
                }
            }
        });

        jawabanTable = $('#jawaban-table').DataTable({
            responsive: true,
            scrollX: true,
            autoWidth: false,
            dom: '<"top"lf>rt<"bottom"ip>',
            data: jawabanData, // Menggunakan jawabapnData sebagai data awal
            columns: [
                { data: 'nomor' },
                { data: 'nama' },
                { data: 'jawaban' },
                { data: 'nilai' },
                { 
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn-action btn-edit" data-id="${row.nomor}"><i class="fas fa-edit"></i> Ubah</button>
                            <button class="btn-action btn-delete" data-id="${row.nomor}"><i class="fas fa-trash"></i> Hapus</button>
                        `;
                    }
                }
            ],
            language: {
                search: "Cari:",
                lengthMenu: "Tampilkan _MENU_ data per halaman",
                info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
                paginate: {
                    first: "Pertama",
                    last: "Terakhir",
                    next: "Selanjutnya",
                    previous: "Sebelumnya"
                }
            }
        });

        // Update nomor urut
        soalTable.on('order.dt search.dt', function () {
            soalTable.column(0, {search:'applied', order:'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();

        soalRealTable.on('order.dt search.dt', function () {
            soalRealTable.column(0, {search:'applied', order:'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();
        
        jawabanTable.on('order.dt search.dt', function () { // Tambahkan untuk jawabanTable
            jawabanTable.column(0, {search:'applied', order:'applied'}).nodes().each(function (cell, i) {
                cell.innerHTML = i+1;
            });
        }).draw();
    }

    // Panggil inisialisasi pertama kali
    initDataTables();

    // Fungsi untuk refresh DataTables (panggil ini setelah operasi CRUD)
    function refreshDataTables() {
        initDataTables();
    }

    // Update dashboard stats
    function updateStats() {
        $('#total-soal').text(temaUjian.length); // Menggunakan temaUjian.length untuk total soal
        $('#total-jawaban').text(jawabanData.length);
        
        const totalNilai = jawabanData.reduce((sum, item) => sum + item.nilai, 0);
        const rataNilai = jawabanData.length > 0 ? (totalNilai / jawabanData.length).toFixed(2) : 0;
        $('#rata-nilai').text(rataNilai);
    }

    updateStats();

    // Menu navigation
    $('.menu li').click(function() {
        $('.menu li').removeClass('active');
        $(this).addClass('active');
        
        const page = $(this).data('page');
        $('.page').removeClass('active');
        $(`#${page}-page`).addClass('active');

        // Pastikan DataTables di-refresh saat navigasi
        if (page === 'soal') {
            soalTable.clear().rows.add(temaUjian).draw();
        } else if (page === 'jawaban') {
            jawabanTable.clear().rows.add(jawabanData).draw();
        }
        updateFABVisibility();
    });

    // fungsi untuk kembali
    $('#back').click(function(){
        $('.menu li').removeClass('active');
        //$(this).addClass('active'); // ini mungkin tidak perlu jika tujuannya hanya kembali ke halaman soal
        
        $('.page').removeClass('active');
        $(`#soal-page`).addClass('active');
        soalTable.clear().rows.add(temaUjian).draw(); // Refresh soalTable saat kembali
        updateFABVisibility();
    });

    // Modal functionality
    const soalModal = $('#soal-modal');
    const jawabanModal = $('#jawaban-modal');
    const soalRealModal = $('#soal-real-modal');

    $('#tambah-soal').click(function() {
        // Reset form sebelum menampilkan modal
        $('#soal-form')[0].reset(); 
        soalModal.show();
    });

    $('#tambah-soal-real').click(function() {
        // Reset form sebelum menampilkan modal
        $('#soal-real-form')[0].reset();
        soalRealModal.show();
    });

    $('#tambah-jawaban').click(function() {
        // Reset form sebelum menampilkan modal
        $('#jawaban-form')[0].reset();
        jawabanModal.show();
    });

    $('.close').click(function() {
        soalModal.hide();
        jawabanModal.hide();
        soalRealModal.hide();
    });

    $(window).click(function(event) {
        if (event.target === soalModal[0]) {
            soalModal.hide();
        }
        if (event.target === jawabanModal[0]) {
            jawabanModal.hide();
        }
        if (event.target === soalRealModal[0]) {
            soalRealModal.hide();
        }
    });

    // Form submission
    $('#soal-form').submit(function(e) {
        e.preventDefault();
        
        let data = {
            id : 0, // ID akan di-generate oleh database
            tanggal: $('#tanggal').val(),
            judul : $('#soal-text').val(),
            deskripsi : $('#jawaban-ideal').val(), // Disini deskripsi adalah jawaban ideal, sesuai dengan penamaan sebelumnya
        };

        buatTema(data); // Panggil fungsi buatTema
        soalModal.hide();
    });

    // Form submission
    $('#soal-real-form').submit(function(e) {
        e.preventDefault();
        
        let data = {
            id : 0, // ID akan di-generate oleh database
            id_tema : $('#id-tema').val(),
            judul_soal : $('#judul-soal').val(),
            rincian : $('#rincian').val(),
            ideal : $('#ideal').val(),
            keyword : $('#keyword').val(),
            saran : $('#saran').val(),
            nasihat : $('#nasihat').val(),
        };

        buatSoal(data); // Panggil fungsi buatSoal
        soalRealModal.hide();
    });

    $('#jawaban-form').submit(function(e) {
        e.preventDefault();
        
        const newJawaban = {
            nomor: jawabanData.length + 1, // Nomor sementara, bisa di-generate dari database
            nama: $('#nama-peserta').val(),
            jawaban: $('#jawaban-peserta').val(),
            nilai: parseInt($('#nilai-peserta').val())
        };
        
        jawabanData.push(newJawaban);
        jawabanTable.row.add(newJawaban).draw(); // Tambahkan langsung ke tabel
        
        $('#nama-peserta').val('');
        $('#jawaban-peserta').val('');
        $('#nilai-peserta').val('');
        
        jawabanModal.hide();
        updateStats();
    });

    // Edit and delete functionality
    $(document).on('click', '.btn-delete', function() {
        const id = $(this).data('id'); // Ini adalah 'id' lokal (contoh: nomor urut di tabel)
        const _id = $(this).data('api'); // Ini adalah '_id' dari restDB
        const tableId = $(this).closest('table').attr('id');
        
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            if (tableId === 'soal-table') {
                temaDel(_id); // Panggil fungsi penghapusan tema dengan _id dari restDB
            } else if (tableId === 'soal-real-table') {
                const idTema = $(this).data('id'); // Ambil id_tema dari tombol
                soalDel(_id, idTema); // Panggil fungsi penghapusan soal dengan _id dan id_tema
            } else if (tableId === 'jawaban-table') {
                jawabanData = jawabanData.filter(item => item.nomor !== id);
                jawabanTable.clear().rows.add(jawabanData).draw();
                updateStats();
            }
        }
    });

    // Edit functionality would be similar but with a modal to edit existing data
    $(document).on('click', '.btn-edit', function() {
        alert('Fitur edit akan diimplementasikan di sini');
    });

    //fungsi filter pada table daftar soal
    function ambilSoalWhere(id_tema){
        // Filter data soalData berdasarkan id_tema yang diberikan
        const filteredSoal = soalData.filter(item => item.id_tema == id_tema);
        soalRealTable.clear().rows.add(filteredSoal).draw();
    }

    // menampilkan soal per ujian
    $(document).on('click', '.btn-look', function() {
        $('.page').removeClass('active');
        $('#soal-real').addClass('active');
        const judulUjian = $(this).data('judul');
        const idTema = $(this).data('id');
        $('#judul-ujian').text(judulUjian);
        $('#id-tema').val(idTema); // Set id_tema ke input hidden di form soal real
        ambilSoalWhere(idTema);
        updateFABVisibility(); // Perbarui visibilitas FAB setelah navigasi
    });

    // fungsi untuk mengambil data judul ujian
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": url + "tema",
      "method": "GET",  
      "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
      }
    }

    function ambilTema(){
        loadscreen();
        $.ajax(settings).done(function (response) {
            temaUjian = response;
            soalTable.clear().rows.add(temaUjian).draw(); // Update DataTable setelah data diambil
            updateStats(); // Perbarui statistik setelah data tema diperbarui
            loadscreen();
        })
        .fail(function(e){
            $('#err-msg').text(JSON.stringify(e));
            loadscreen();
        });
    }
    
    // fungsi untuk mengambil data soal
    let soalSet = {
      "async": true,
      "crossDomain": true,
      "url": url + "soal",
      "method": "GET",  
      "headers": {
            "content-type": "application/json",
            "x-apikey": `${myapi}`,
            "cache-control": "no-cache"
      }
    }

    function ambilSoal(){
        loadscreen();
        $.ajax(soalSet).done(function (response) {
            soalData = response;
            // soalRealTable.clear().rows.add(soalData).draw(); // Jangan langsung draw semua soal di sini, karena sudah ada filter ambilSoalWhere
            loadscreen();
        })
        .fail(function(e){
            $('#err-msg').text(JSON.stringify(e));
            loadscreen();
        });
    }

    // fungsi untuk membuat data ujian
    function buatTema(data){
        let buatTemaSet = {
            "async": true,
            "crossDomain": true,
            "url": url + "tema",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "x-apikey": `${myapi}`,
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        loadscreen();
        $.ajax(buatTemaSet).done(function (response) {
            console.log(response);
            ambilTema(); // Panggil ambilTema untuk me-refresh data dan tabel
            loadscreen();
        });
    }

    // fungsi untuk membuat data soal
    function buatSoal(data){
        let buatSoalSet = {
            "async": true,
            "crossDomain": true,
            "url": url + "soal",
            "method": "POST",
            "headers": {
                "content-type": "application/json",
                "x-apikey": `${myapi}`,
                "cache-control": "no-cache"
            },
            "processData": false,
            "data": JSON.stringify(data)
        }

        loadscreen();
        $.ajax(buatSoalSet).done(function (response) {
            console.log(response);
            ambilSoal(); // Refresh data soalData
            // Setelah membuat soal baru, filter dan tampilkan soal yang relevan
            const idTema = $('#id-tema').val();
            if (idTema) {
                // Beri sedikit delay untuk memastikan 'soalData' sudah terupdate dari 'ambilSoal()'
                setTimeout(() => ambilSoalWhere(idTema), 500); 
            }
            loadscreen();
        });
    }

    // fungsi untuk menghapus tema
    function temaDel(_id){
        var temaDelSet = {
            "async": true,
            "crossDomain": true,
            "url": url + "tema/"+ _id,
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "x-apikey": myapi,
                "cache-control": "no-cache"
            }
        }
        loadscreen();
        $.ajax(temaDelSet).done(function (response) {
            console.log(response);
            ambilTema(); // Panggil ambilTema untuk me-refresh data dan tabel
            loadscreen();
        });
    }

    // untuk hapus soal
    function soalDel(_id, id_tema_for_filter){
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": url + "soal/" + _id,
            "method": "DELETE",
            "headers": {
                "content-type": "application/json",
                "x-apikey": myapi,
                "cache-control": "no-cache"
            }
        }
        loadscreen();
        $.ajax(settings).done(function (response) {
            console.log(response);
            ambilSoal(); // Refresh data soalData
            // Setelah menghapus soal, filter dan tampilkan soal yang relevan
            setTimeout(() => ambilSoalWhere(id_tema_for_filter), 300);
            loadscreen();
        });
    }

    // fungsi loadscreen
    function loadscreen(){
        let ls = $('#loadscreen');
        if(ls.hasClass('ls-active')){
            ls.removeClass('ls-active');
            ls.addClass('ls-gone');
        }
        else {
            ls.removeClass('ls-gone');
            ls.addClass('ls-active');
        }
    }
    
    // Fungsi untuk menampilkan/menyembunyikan FAB
    function updateFABVisibility() {
      
        $('.fab').hide();
        const activePage = $('.page.active').attr('id'); // Ambil id halaman yang aktif
        
        if (activePage === 'soal-page') {
            $('#tambah-soal').show();
        } else if (activePage === 'jawaban-page') {
            $('#tambah-jawaban').show();
        } else if (activePage === 'soal-real') {
            $('#tambah-soal-real').show();
        }
        
    }

    // Inisialisasi awal
    updateFABVisibility();
    
    // Panggil fungsi pengambilan data saat pertama kali halaman dimuat
    ambilTema();
    function hold(){
    if(temaUjian.length <= 0){
    setTimeout(()=>{
      hold()
      },1000);
    }
    else{
      ambilSoal();
    }
    }
    hold()
      
});

