<form action="https://www.payfast.co.za/eng/process" method="post" id="payfastForm">
    @foreach($data as $key => $value)
        <input type="hidden" name="{{ $key }}" value="{{ $value }}">
    @endforeach
</form>
<script>document.getElementById('payfastForm').submit();</script>