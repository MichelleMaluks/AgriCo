<!DOCTYPE html>
<html>

<head>
    <title>Redirecting to PayFast...</title>
</head>

<body onload="document.forms['payfastForm'].submit();">
    <form name="payfastForm" method="post" action="https://www.payfast.co.za/eng/process">
        @foreach($data as $key => $value)
            <input type="hidden" name="{{ $name }}" value="{{ $value }}">
        @endforeach
        <noscript>
            <button type="submit">Click here if not redirected</button>
        </noscript>
    </form>
</body>

</html>