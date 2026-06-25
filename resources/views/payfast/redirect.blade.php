<!DOCTYPE html>
<html>

<head>
    <title>Redirecting to PayFast...</title>
</head>

<body onload="document.forms['payfastForm'].submit();">
    <form action="{{ $payfastUrl }}" method="post" id="payfastForm">
        @foreach($data as $name => $value)
            <input type="hidden" name="{{ $name }}" value="{{ $value }}">
        @endforeach
    </form>
    <script>
        document.getElementById('payfastForm').submit();
    </script>
</body>

</html>