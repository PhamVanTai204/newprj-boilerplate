using newprj.Debugging;

namespace newprj;

public class newprjConsts
{
    public const string LocalizationSourceName = "newprj";

    public const string ConnectionStringName = "Default";

    public const bool MultiTenancyEnabled = true;


    /// <summary>
    /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
    /// </summary>
    public static readonly string DefaultPassPhrase =
        DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "764a56f25f964cd0832f706736b5d4fa";
}
